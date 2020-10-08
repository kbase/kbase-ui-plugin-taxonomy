
export enum ObjectClass {
    TAXONOMY,
    ONTOLOGY
}

export enum LoadingStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface NoneState {
    status: LoadingStatus.NONE;
}

export interface LoadingState {
    status: LoadingStatus.LOADING;
}

export interface ErrorState {
    status: LoadingStatus.ERROR;
    message: string;
}

export interface LoadedState {
    status: LoadingStatus.LOADED;
}
