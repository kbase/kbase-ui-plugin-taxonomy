// import { UIError } from '../types/error';

export interface DBProps<T> {
    onUpdate: () => void;
    initialData: T;
}

export interface TheDB<T> {
    data: T;
}

export enum DBCollectionStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR,
    RELOADING
}

export interface DBCollectionBase {
    status: DBCollectionStatus
}

export interface DBCollectionNone extends DBCollectionBase {
    status: DBCollectionStatus.NONE
}

export interface DBCollectionLoading<T> extends DBCollectionBase {
    status: DBCollectionStatus.LOADING,
    data: T
}

export interface DBCollectionLoaded<T> extends DBCollectionBase {
    status: DBCollectionStatus.LOADED,
    data: T
}

export interface DBCollectionReloading<T> extends DBCollectionBase {
    status: DBCollectionStatus.RELOADING,
    data: T
}

export interface DBCollectionError<T> extends DBCollectionBase {
    status: DBCollectionStatus.ERROR,
    error: T
}

export default class DB<T> {
    db: TheDB<T>;
    stopped: boolean;
    onUpdate: () => void;
    constructor(props: DBProps<T>) {
        this.onUpdate = props.onUpdate;
        this.db = {
            data: props.initialData
        };
        this.stopped = false;
    }

    forceComponentUpdate() {
        if (this.stopped) {
            return;
        }
        this.onUpdate();
    }

    set(updateFun: (state: T) => T) {
        this.db.data = updateFun(this.db.data);
        this.forceComponentUpdate();
    }

    get(): T {
        return this.db.data;
    }

    stop() {
        this.stopped = true;
    }
}
