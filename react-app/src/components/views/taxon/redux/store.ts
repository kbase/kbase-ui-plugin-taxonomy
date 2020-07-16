import { LoadedState, NoneState, LoadingState, ErrorState } from "../../../../types";
import { TaxonomyReference, Taxon } from '../../../../types/taxonomy';


export interface MainLoadedState extends LoadedState {
    selectedTaxonRef: TaxonomyReference;
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
}

export type MainState = NoneState | LoadingState | ErrorState | MainLoadedState;

type State = NoneState | LoadedState | LoadingState | ErrorState;



// export function makeInitialStoreState(): TaxonomyStoreState {
//     return {
//         taxonomy: {
//             main: {
//                 state: {
//                     status: LoadingStatus.NONE
//                 }
//             }
//         }
//     };
// }

// export function createReduxStore() {
//     return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
// }
