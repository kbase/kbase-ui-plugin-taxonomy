import { BaseStoreState, makeBaseStoreState } from '@kbase/ui-components';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

// import { TaxonomyStoreState } from '../../landingPages/taxonomy/redux/store';
// import { TaxonomyReference } from '../../types/taxonomy';
// import { AsyncViewStatus, TopLevelView, ViewType, ViewBase } from './view';
// import { TaxonomyView } from './taxonomy';
// import { DataSourceInfo } from '../../lib/RelationEngineAPIClient';
// import { DataSourceInfo } from '../../lib/RelationEngineModel';


export type RelationEngineID = string;
export enum RelationEngineNodeType {
    TAXON,
    ONTOLOGY_TERM
}

export enum ViewStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

// export interface RelationEngineViewBase {
//     status: ViewStatus;
// }

// export interface RelationEngineViewNone {
//     status: ViewStatus.NONE;
// }

// export interface RelationEngineViewLoading {
//     status: ViewStatus.LOADING;
// }

// export interface RelationEngineViewLoaded {
//     status: ViewStatus.LOADED;
//     relationEngineID: RelationEngineID;
//     relationEngineNodeType: RelationEngineNodeType;
//     viewType: ViewType;
//     currentView: LandingPageView;
// }

// export interface RelationEngineViewError {
//     status: ViewStatus.ERROR;
//     message: string;
// }

// export type RelationEngineView =
//     | RelationEngineViewNone
//     | RelationEngineViewLoading
//     | RelationEngineViewLoaded
//     | RelationEngineViewError;

export interface LandingPageStoreState { }




// export interface NavigationBase {
//     type: ViewType;
//     relationEngineID: RelationEngineID;
// }

// export interface NavigationNone {
//     type: ViewType.NONE;
// }

// export interface NavigationTaxonomy {
//     type: ViewType.TAXONOMY;
//     ref: TaxonomyReference;
//     dataSource: DataSourceInfo;
// }

// export interface NavigationOntology {
//     type: ViewType.ONTOLOGY;
//     ref: OntologyReference;
//     dataSource: DataSourceInfo;
// }

// export type NavigationSome = NavigationTaxonomy | NavigationOntology;
// export type Navigation = NavigationNone | NavigationSome;

// // export interface ViewState<T, S> {
// //     type: T;
// //     state: S;
// // }

// // export type LandingPageView = TaxonomyView;

// // OKAY, back to REDUX

// // export interface TaxonomyView {

// // }

// // export interface OntologyView {

// // }



// export type View = ViewBase<TaxonomyView> | ViewBase<OntologyView> | null;


// STORE STATE type definition
export interface StoreState extends BaseStoreState {
    // navigation: Navigation;
    // trigger: number;
    // view: TopLevelView;
}

// Store Construction
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    return {
        ...baseStoreState,
        // viewer: null,
        // navigation: {
        //     type: ViewType.NONE
        // },
        // trigger: 0,
        // view: {
        //     status: AsyncViewStatus.NONE
        // }
    };
}

export function createReduxStore() {
    return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}
