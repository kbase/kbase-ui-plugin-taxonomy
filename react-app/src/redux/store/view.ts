// import { RelationEngineReference } from "../../types/core";
import { UIError } from '../../types/error';
// import { TaxonomyView } from "./taxonomy";

// VIEW STATES

/*
 Sync view state
 Primarily for top level views which don't have an async load operation.
*/

export enum SyncViewStatus {
    NONE,
    LOADED,
    ERROR
}

export interface SyncViewNone {
    status: SyncViewStatus.NONE;
}

export interface SyncViewError<E> {
    status: SyncViewStatus.ERROR;
    error: E;
}

export interface SyncViewLoaded<S> {
    status: SyncViewStatus.LOADED;
    state: S;
}
export type SyncView<S, E> = SyncViewNone | SyncViewLoaded<S> | SyncViewError<E>;

/*
Async view state
For any component which requires loading.
*/

// export interface AsyncViewNone<T> {
//     status: AsyncViewStatus.NONE;
//     type: T;
// }

// export interface AsyncViewLoading<T> {
//     status: AsyncViewStatus.LOADING;
//     type: T;
// }

// export interface AsyncViewError<T> {
//     status: AsyncViewStatus.ERROR;
//     error: string;
//     type: T;
// }

// export interface AsyncViewLoaded<T, S> {
//     status: AsyncViewStatus.LOADED;
//     type: T;
//     state: S;
// }

// export type AsyncView<T, S> = AsyncViewNone<T> | AsyncViewLoading<T> | AsyncViewLoaded<T, S> | AsyncViewError<T>;


// And the specific landing page views

// export enum AsyncViewStatus {
//     NONE,
//     LOADING,
//     LOADED,
//     ERROR
// }

// export interface AsyncViewNone<> {
//     status: AsyncViewStatus.NONE;
// }

// export interface AsyncViewLoading<> {
//     status: AsyncViewStatus.LOADING;
// }

// export interface AsyncViewError<E> {
//     status: AsyncViewStatus.ERROR;
//     error: E;
// }

// export interface AsyncViewLoaded<S> {
//     status: AsyncViewStatus.LOADED;
//     state: S;
// }

// export type AsyncView<S, E> = AsyncViewNone | AsyncViewLoading | AsyncViewLoaded<S> | AsyncViewError<E>;

// /*
// The view base is the wrapper for all landing page views.
// It's purpose is to provide an anchor for the view, regardless of what happens in that view
// (which is to be found in the "state" property)
// */

// export enum ViewType {
//     NONE,
//     TAXONOMY,
//     ONTOLOGY
// }

// // export interface ViewBase<S> {
// //     type: ViewType;
// //     ref: RelationEngineReference;
// //     state: AsyncView<TopLevelViewState, UIError>
// // }

// export interface ViewBase<S> {
//     type: ViewType;
//     ref: RelationEngineReference;
//     state: AsyncView<S, UIError>
// }

// /*
//     The top level view.
//     Each top level view is a generic interface with some fixed properties.
// */

// // export type MainView = ViewBase<TaxonomyView> | ViewBase<OntologyView> | null;

// export type MainView = AsyncView<TaxonomyView, UIError> | AsyncView<OntologyView, UIError>;

// export interface TopLevelViewStateBase {
//     type: ViewType;
//     ref: RelationEngineReference;
//     view: MainView;
// }

// export interface TopLevelViewStateTaxonomy extends TopLevelViewStateBase {
//     type: ViewType.TAXONOMY;
//     view: AsyncView<TaxonomyView, UIError>;
// };

// export interface TopLevelViewStateOntology extends TopLevelViewStateBase {
//     type: ViewType.ONTOLOGY;
//     view: AsyncView<OntologyView, UIError>;
// }

// export type TopLevelViewState = TopLevelViewStateTaxonomy | TopLevelViewStateOntology;


// export type TopLevelView = AsyncView<TopLevelViewState, UIError>
