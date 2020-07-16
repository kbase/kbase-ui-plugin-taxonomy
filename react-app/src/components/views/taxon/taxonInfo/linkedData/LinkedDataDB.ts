import DB, {
    DBProps, DBCollectionNone,
    DBCollectionLoading, DBCollectionLoaded,
    DBCollectionReloading, DBCollectionError, DBCollectionStatus
} from '../../../../../lib/DB2';
import { AppConfig } from '@kbase/ui-components';
import { TaxonomyModel, LinkedObject, GetLinkedObjectsResult } from '../../../../../lib/TaxonomyModel';
import { TaxonomyReference } from '../../../../../types/taxonomy';
import { UIError } from '../../../../../types/error';

export interface LinkedObjectsData {
    linkedObjects: Array<LinkedObject>;
    totalCount: number;
    page: number;
    pageSize: number;
}

export type LinkedObjectsStateNone = DBCollectionNone;
export type LinkedObjectsStateLoading = DBCollectionLoading<LinkedObjectsData>;
export type LinkedObjectsStateLoaded = DBCollectionLoaded<LinkedObjectsData>;
export type LinkedObjectsStateReloading = DBCollectionReloading<LinkedObjectsData>;
export type LinkedObjectsStateError = DBCollectionError<UIError>;

export type LinkedObjectsCollection =
    LinkedObjectsStateNone |
    LinkedObjectsStateLoading |
    LinkedObjectsStateLoaded |
    LinkedObjectsStateReloading |
    LinkedObjectsStateError;

// export type LinkedDataDBStateNone = DBStateNone;
// export type LinkedDataDBStateLoading = DBStateLoading;
// export type LinkedDataDBStateError = DBStateError;

// export interface LinkedDataDBStateLoaded extends DBStateLoaded {
//     linkedObjects: Array<LinkedObject>;

// }

// export type LinkedDataDBState =
//     | LinkedDataDBStateNone
//     | LinkedDataDBStateLoading
//     | LinkedDataDBStateLoaded
//     | LinkedDataDBStateError;


export enum SortDirection {
    ASCENDING,
    DESCENDING
}

export function stringToSortDirection(direction: string) {
    switch (direction) {
        case 'ascending':
            return SortDirection.ASCENDING;
        case 'descending':
            return SortDirection.DESCENDING;
        default:
            throw new Error('Unknown sort direction: ' + direction);
    }
}

export interface SortSpec {
    sortColumn: string;
    sortDirection: SortDirection;
}

export interface LinkedObjectsDBState {
    linkedObjectsCollection: LinkedObjectsCollection;
}

export interface LinkedDataDBProps extends DBProps<LinkedObjectsDBState> {
    token: string;
    config: AppConfig;
}

export class AsyncTask<T> {
    taskFun: () => Promise<T>;
    hasResult: boolean;
    result: T | null;
    canceled: boolean;
    constructor(taskFun: () => Promise<T>) {
        this.taskFun = taskFun;
        this.result = null;
        this.hasResult = false;
        this.canceled = false;
    }

    async run() {
        try {
            this.result = await this.taskFun();
            return this.result;
        } catch (ex) {
            throw (ex);
        }
    }

    cancel() {
        this.canceled = true;
    }

    get(): T {
        if (this.result === null) {
            throw new Error('Attempt to fetch value when not set');
        }
        return this.result;
    }

    isCanceled(): boolean {
        return this.canceled;
    }
}

export default class LinkedDataDB extends DB<LinkedObjectsDBState> {
    props: LinkedDataDBProps;
    currentTask: AsyncTask<GetLinkedObjectsResult> | null;
    constructor(props: LinkedDataDBProps) {
        super(props);
        this.currentTask = null;
        this.props = props;
    }

    async fetchLinkedObjects({ taxonRef, page, pageSize }: { taxonRef: TaxonomyReference; page: number; pageSize: number; }) {
        if (this.currentTask) {
            this.currentTask.cancel();
        }
        const task = async (): Promise<GetLinkedObjectsResult> => {
            const {
                config: {
                    services: {
                        ServiceWizard: { url },
                        RelationEngine: { url: relationEngineURL },
                    },
                    dynamicServices: {
                        TaxonomyAPI: taxonomyAPIConfig
                    }
                },
                token,
            } = this.props;

            const client = new TaxonomyModel({
                token,
                url,
                relationEngineURL,
                taxonomyAPIConfig
            });

            const offset = (page - 1) * pageSize;
            const limit = pageSize;

            const result = await client.getLinkedObjects(taxonRef, {
                offset,
                limit
            });
            return result;
        };

        // Set up loading based on the current state.

        this.set((state: LinkedObjectsDBState) => {
            switch (state.linkedObjectsCollection.status) {
                case DBCollectionStatus.LOADING:
                case DBCollectionStatus.LOADED:
                case DBCollectionStatus.RELOADING:
                    return {
                        ...state,
                        linkedObjectsCollection: {
                            ...state.linkedObjectsCollection,
                            status: DBCollectionStatus.LOADING
                        }
                    };
                case DBCollectionStatus.NONE:
                case DBCollectionStatus.ERROR:
                default:
                    return {
                        ...state,
                        linkedObjectsCollection: {
                            status: DBCollectionStatus.LOADING,
                            data: {
                                linkedObjects: [],
                                page, pageSize,
                                totalCount: 0
                            }
                        }
                    };
            }
        });

        const newTask = new AsyncTask<GetLinkedObjectsResult>(task);
        this.currentTask = newTask;

        try {
            const result = await newTask.run();
            if (newTask.isCanceled()) {
                return;
            }
            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    linkedObjectsCollection: {
                        status: DBCollectionStatus.LOADED,
                        data: {
                            ...result,
                            page,
                            pageSize
                        }
                    }
                };
            });
            this.currentTask = null;
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    linkedObjectsCollection: {
                        status: DBCollectionStatus.ERROR,
                        error: {
                            code: 'not-found',
                            message: ex.message,
                            source: 'LinkedDataDB.fetchLinkedObjects'
                        }
                    }
                };
            });
        }
    }

    async queryLinkedObjects({ taxonRef, page, pageSize, sort }: { taxonRef: TaxonomyReference; page: number; pageSize: number, sort: SortSpec | null; }) {
        if (this.currentTask) {
            this.currentTask.cancel();
        }
        const task = async (): Promise<GetLinkedObjectsResult> => {
            const {
                config: {
                    services: {
                        ServiceWizard: { url },
                        RelationEngine: { url: relationEngineURL },
                    },
                    dynamicServices: {
                        TaxonomyAPI: taxonomyAPIConfig
                    }
                },
                token,
            } = this.props;

            const client = new TaxonomyModel({
                token,
                url,
                relationEngineURL,
                taxonomyAPIConfig
            });

            const offset = (page - 1) * pageSize;
            const limit = pageSize;

            const result = await client.getLinkedObjects(taxonRef, {
                offset,
                limit
            });

            return result;
        };

        // Set up loading based on the current state.

        this.set((state: LinkedObjectsDBState) => {
            switch (state.linkedObjectsCollection.status) {
                case DBCollectionStatus.LOADING:
                case DBCollectionStatus.LOADED:
                case DBCollectionStatus.RELOADING:
                    return {
                        ...state,
                        linkedObjectsCollection: {
                            ...state.linkedObjectsCollection,
                            status: DBCollectionStatus.LOADING
                        }
                    };
                case DBCollectionStatus.NONE:
                case DBCollectionStatus.ERROR:
                default:
                    return {
                        ...state,
                        linkedObjectsCollection: {
                            status: DBCollectionStatus.LOADING,
                            data: {
                                linkedObjects: [],
                                page, pageSize,
                                totalCount: 0
                            }
                        }
                    };
            }
        });

        const newTask = new AsyncTask<GetLinkedObjectsResult>(task);
        this.currentTask = newTask;

        try {
            const result = await newTask.run();
            if (newTask.isCanceled()) {
                return;
            }
            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    linkedObjectsCollection: {
                        status: DBCollectionStatus.LOADED,
                        data: {
                            ...result,
                            page,
                            pageSize
                        }
                    }
                };
            });
            this.currentTask = null;
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    linkedObjectsCollection: {
                        status: DBCollectionStatus.ERROR,
                        error: {
                            code: 'not-found',
                            message: ex.message,
                            source: 'LinkedDataDB.fetchLinkedObjects'
                        }
                    }
                };
            });
        }
    }
}
