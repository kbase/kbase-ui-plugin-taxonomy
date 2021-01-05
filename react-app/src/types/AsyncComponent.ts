export enum AsyncComponentState {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface AsyncComponentNone {
    state: AsyncComponentState.NONE;
}

export interface AsyncComponentLoading {
    state: AsyncComponentState.LOADING;
}

export interface AsyncComponentLoaded<T> {
    state: AsyncComponentState.LOADED;
    value: T;
}

export interface AsyncComponentError<E> {
    state: AsyncComponentState.ERROR;
    error: E;
}

export type AsyncComponent<T, E> = AsyncComponentNone | AsyncComponentLoading | AsyncComponentLoaded<T> | AsyncComponentError<E>;