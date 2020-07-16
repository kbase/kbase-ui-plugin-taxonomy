import { Action, Reducer } from 'redux';
import { baseReducer, BaseStoreState } from '@kbase/ui-components';
import { StoreState } from '../store';

// function navigateSuccess(state: StoreState, action: NavigateSuccess): StoreState {
//     return {
//         ...state,
//         // view: {
//         //     status: ViewStatus.LOADED,
//         //     relationEngineID: action.relationEngineID,
//         //     relationEngineNodeType: action.relationEngineNodeType,
//         //     viewType: action.viewType,
//         //     currentView: action.view
//         // }
//         navigation: action.navigation,
//         trigger: Date.now()
//     };
// }

// function navigateError(state: StoreState, action: NavigateError): StoreState {
//     return {
//         ...state,

//         // TODO: Need to add navigation error condition to the store...
//     };
// }

// function navigateStart(state: StoreState, action: NavigateStart): StoreState {
//     return {
//         ...state,
//         view: {
//             status: ViewStatus.LOADING
//         }
//     };
// }

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    const baseState = baseReducer(state as BaseStoreState, action);
    if (baseState) {
        return baseState as StoreState;
    }
    if (!state) {
        return state;
    }
    switch (action.type) {
        // case AppActions.NAVIGATE_START:
        //     return navigateStart(state, action as NavigateStart);
        // case AppActions.NAVIGATE_SUCCESS:
        //     return navigateSuccess(state, action as NavigateSuccess);
        // case AppActions.NAVIGATE_ERROR:
        //     return navigateError(state, action as NavigateError);
    }
    return state;
};

export default reducer;
