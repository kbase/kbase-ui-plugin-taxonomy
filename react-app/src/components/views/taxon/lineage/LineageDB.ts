import DB, {
    DBProps, DBStatus,
    DBStateNone, DBStateLoading, DBStateLoaded, DBStateError
} from '../../../../lib/DB';
import { AppConfig } from '@kbase/ui-components';
import { Taxon, TaxonomyReference } from '../../../../types/taxonomy';
import { TaxonomyModel } from '../../../../lib/TaxonomyModel';

export type LineageDBStateNone = DBStateNone;
export type LineageDBStateLoading = DBStateLoading;
export type LineageDBStateError = DBStateError;

export interface LineageDBStateLoaded extends DBStateLoaded {
    lineage: Array<Taxon>;
}

export type LineageDBState = LineageDBStateNone | LineageDBStateLoading | LineageDBStateLoaded | LineageDBStateError;

export interface LineageDBProps extends DBProps<LineageDBState> {
    token: string;
    config: AppConfig;
}

// TODO: make props part of generic
export default class LineageDB extends DB<LineageDBState> {
    props: LineageDBProps;
    constructor(props: LineageDBProps) {
        super(props);
        this.props = props;
    }
    async getLineage(taxonRef: TaxonomyReference) {
        try {
            this.set((state: LineageDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                };
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
            const lineage = await client.getLineage(taxonRef);
            this.set((state: LineageDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    lineage
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: LineageDBState) => {
                return {
                    status: DBStatus.ERROR,
                    error: {
                        code: 'not-found',
                        source: 'LineageDB.getLineage',
                        message: ex.message,
                    }
                };
            });
        }
    }
}
