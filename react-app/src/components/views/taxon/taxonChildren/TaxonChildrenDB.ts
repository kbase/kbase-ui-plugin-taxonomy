import DB, {
    DBProps,
    DBStatus,
    DBStateNone,
    DBStateLoading,
    DBStateLoaded,
    DBStateError,
    DBStateReLoading
} from '../../../../lib/DB';
import { AppConfig } from '@kbase/ui-components';
import { Taxon, TaxonomyReference } from '../../../../types/taxonomy';
import { TaxonomyModel } from '../../../../lib/TaxonomyModel';

export type TaxonDBStateNone = DBStateNone;
export type TaxonDBStateLoading = DBStateLoading;
export type TaxonDBStateError = DBStateError;

export interface TaxonDBStateLoaded extends DBStateLoaded {
    taxa: Array<Taxon>;
    total: number;
    page: number;
    pageSize: number;
}

export interface TaxonDBStateReLoading extends DBStateReLoading {
    taxa: Array<Taxon>;
    total: number;
    page: number;
    pageSize: number;
}

export type TaxonDBState =
    | TaxonDBStateNone
    | TaxonDBStateLoading
    | TaxonDBStateLoaded
    | TaxonDBStateReLoading
    | TaxonDBStateError;

export interface TaxonDBProps extends DBProps<TaxonDBState> {
    token: string;
    config: AppConfig;

}

export default class TaxonChildrenDB extends DB<TaxonDBState> {
    props: TaxonDBProps;
    constructor(props: TaxonDBProps) {
        super(props);
        this.props = props;
    }
    // Remember, pages are 1 based; offset is 0 based.
    // async fetchTaxa(taxonID: TaxonID, page: number, pageSize: number) {
    //     try {
    //         this.set((state: TaxonDBState) => {
    //             return {
    //                 ...state,
    //                 status: DBStatus.LOADING
    //             };
    //         });

    //         const client = new TaxonomyModel({
    //             token: this.token,
    //             url: this.serviceWizardURL
    //         });

    //         const offset = (page - 1) * pageSize;
    //         const limit = pageSize;

    //         const [taxa, totalCount] = await client.getChildren(taxonID, {
    //             offset,
    //             limit
    //         });
    //         this.set((state: TaxonDBState) => {
    //             return {
    //                 ...state,
    //                 status: DBStatus.LOADED,
    //                 taxa,
    //                 total: totalCount,
    //                 page,
    //                 pageSize
    //             };
    //         });
    //     } catch (ex) {
    //         console.error('ERROR', ex);
    //         this.set((state: TaxonDBState) => {
    //             return {
    //                 status: DBStatus.ERROR,
    //                 message: ex.message
    //             };
    //         });
    //     }
    // }

    async fetchChildren({
        taxonRef,
        page,
        pageSize,
        searchTerm
    }: {
        taxonRef: TaxonomyReference;
        page: number;
        pageSize: number;
        searchTerm: string;
    }) {
        try {
            this.set((state: TaxonDBState) => {
                if (state.status === DBStatus.LOADED) {
                    return {
                        ...state,
                        status: DBStatus.RELOADING
                    };
                } else {
                    return {
                        ...state,
                        status: DBStatus.LOADING
                    };
                }
            });

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

            const [taxa, totalCount] = await client.getChildren(taxonRef, {
                offset,
                limit,
                searchTerm
            });
            this.set((state: TaxonDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    taxa,
                    total: totalCount,
                    page,
                    pageSize
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: TaxonDBState) => {
                return {
                    status: DBStatus.ERROR,
                    error: {
                        code: 'not-found',
                        source: 'TaxonChildrenDB.fetchChildren',
                        message: ex.message,
                    }
                };
            });
        }
    }
}
