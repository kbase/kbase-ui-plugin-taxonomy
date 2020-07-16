import { Action, Dispatch } from 'redux';
import { Taxon, TaxonomyReference } from '../../../../types/taxonomy';
import { TaxonomyModel } from '../../../../lib/TaxonomyModel';
import { StoreState } from '../../../../redux/store';

/**
 * All of our lovely action types :)
 */
export enum TaxonomyActionType {
    LOAD,
    LOAD_START,
    LOAD_SUCCESS,
    LOAD_ERROR,
    UNLOAD,
    SELECT_TAXON,
    SELECT_TAXON_START,
    SELECT_TAXON_SUCCESS,
    SELECT_TAXON_ERROR,
    SEARCH_CHILDREN,
    SEARCH_CHILDREN_START,
    SEARCH_CHILDREN_SUCCESS,
    SEARCH_CHILDREN_ERROR
}

/**
 * Action Types
 */

export interface Load extends Action<TaxonomyActionType.LOAD> {
    type: TaxonomyActionType.LOAD;
}

export interface LoadStart extends Action<TaxonomyActionType.LOAD_START> {
    type: TaxonomyActionType.LOAD_START;
}

export interface LoadSuccess extends Action<TaxonomyActionType.LOAD_SUCCESS> {
    type: TaxonomyActionType.LOAD_SUCCESS;
    // lineage: Array<Taxon>;
    // offspring: Array<Taxon>;
    selectedTaxonRef: TaxonomyReference;
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
}

export interface LoadError extends Action<TaxonomyActionType.LOAD_ERROR> {
    type: TaxonomyActionType.LOAD_ERROR;
    message: string;
}

export interface Unload extends Action<TaxonomyActionType.UNLOAD> {
    type: TaxonomyActionType.UNLOAD;
}

/**
 * Action Generators
 */

export function loadStart(): LoadStart {
    return {
        type: TaxonomyActionType.LOAD_START
    };
}

export function loadError(message: string): LoadError {
    return {
        type: TaxonomyActionType.LOAD_ERROR,
        message
    };
}

export function loadSuccess(selectedTaxonRef: TaxonomyReference, selectedTaxon: Taxon, targetTaxon: Taxon): LoadSuccess {
    return {
        type: TaxonomyActionType.LOAD_SUCCESS,
        selectedTaxonRef,
        selectedTaxon,
        targetTaxon
    };
}

export function unload() {
    return {
        type: TaxonomyActionType.UNLOAD
    };
}

/**
 * Thunks
 */

export function load(taxonRef: TaxonomyReference) {
    return async (dispatch: Dispatch<Action>, getState: () => StoreState) => {
        dispatch(loadStart());

        const {
            auth: { userAuthorization },
            app: {
                config: {
                    services: {
                        ServiceWizard: { url: serviceWizardURL },
                        RelationEngine: { url: relationEngineURL }
                    },
                    dynamicServices: {
                        TaxonomyAPI: taxonomyAPIConfig
                    }
                }
            }
        } = getState();

        if (!userAuthorization) {
            dispatch(loadError('Taxonomy may only start with authentication'));
            return;
        }

        const { token } = userAuthorization;

        const client = new TaxonomyModel({
            token: token,
            url: serviceWizardURL,
            relationEngineURL,
            taxonomyAPIConfig
            // url: 'http://localhost:3001/services/service_wizard'
        });
        // const lineage = await client.getLineage(taxonID);

        // const [offspring, totalCount] = await client.getChildren(taxonID, { offset: 0, limit: 10 });
        const targetTaxon = await client.getTaxon(taxonRef);

        dispatch(loadSuccess(taxonRef, targetTaxon, targetTaxon));
    };
}

/**
 * Taxon Selection actions
 */

export interface SelectTaxon {
    type: TaxonomyActionType.SELECT_TAXON;
    taxonRef: TaxonomyReference;
}

interface SelectTaxonStart {
    type: TaxonomyActionType.SELECT_TAXON_START;
}

interface SelectTaxonError {
    type: TaxonomyActionType.SELECT_TAXON_ERROR;
    message: string;
}

interface SelectTaxonSuccess {
    type: TaxonomyActionType.SELECT_TAXON_SUCCESS;
    taxon: Taxon;
}

/**
 * Taxon selection action generators
 */

function selectTaxonStart(): SelectTaxonStart {
    return {
        type: TaxonomyActionType.SELECT_TAXON_START
    };
}

function selectTaxonError(message: string): SelectTaxonError {
    return {
        type: TaxonomyActionType.SELECT_TAXON_ERROR,
        message
    };
}

function selectTaxonSuccess(taxon: Taxon): SelectTaxonSuccess {
    return {
        type: TaxonomyActionType.SELECT_TAXON_SUCCESS,
        taxon
    };
}

/**
 * Thunks
 */

export function selectTaxon(taxonRef: TaxonomyReference) {
    return async (dispatch: Dispatch<Action>, getState: () => StoreState) => {
        dispatch(selectTaxonStart());

        const {
            auth: { userAuthorization },
            app: {
                config: {
                    services: {
                        ServiceWizard: { url: serviceWizardURL },
                        RelationEngine: { url: relationEngineURL }
                    },
                    dynamicServices: {
                        TaxonomyAPI: taxonomyAPIConfig
                    }
                }
            }
        } = getState();

        if (!userAuthorization) {
            dispatch(selectTaxonError('Taxonomy may only start with authentication'));
            return;
        }

        const { token } = userAuthorization;

        const client = new TaxonomyModel({
            token: token,
            url: serviceWizardURL,
            relationEngineURL,
            taxonomyAPIConfig
        });

        try {
            const taxon = await client.getTaxon(taxonRef);
            dispatch(selectTaxonSuccess(taxon));
        } catch (ex) {
            dispatch(selectTaxonError(ex.message));
        }
    };
}
