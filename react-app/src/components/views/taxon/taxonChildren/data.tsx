import React from 'react';
import TaxonDB, { TaxonDBState, TaxonDBStateError } from './TaxonChildrenDB';
import { DBStatus } from '../../../../lib/DB';

import { AppConfig } from '@kbase/ui-components';
import TaxonChildren from './TaxonChildren';
import { TaxonomyReference } from '../../../../types/taxonomy';
import { Alert } from 'antd';

export interface Props {
    token: string;
    config: AppConfig;
    taxonRef: TaxonomyReference;
    selectedTaxonRef: TaxonomyReference | null;
    selectTaxonRef: (taxonRef: TaxonomyReference) => void;
    navigateToTaxonRef: (taxonRef: TaxonomyReference) => void;
}

interface State { }

export default class Data extends React.Component<Props, State> {
    db: TaxonDB;
    constructor(props: Props) {
        super(props);
        this.db = new TaxonDB({
            onUpdate: () => {
                this.forceUpdate();
            },
            initialData: {
                status: DBStatus.NONE
            },
            token: props.token,
            config: props.config
        });
    }

    componentDidMount() {
        // this.db.stop();
    }

    fetchChildren(taxonRef: TaxonomyReference, page: number, pageSize: number, searchTerm: string) {
        return this.db.fetchChildren({ taxonRef, page, pageSize, searchTerm });
    }

    renderSuccess(db: TaxonDBState) {
        return <TaxonChildren
            db={db}
            taxonRef={this.props.taxonRef}
            selectedTaxonRef={this.props.selectedTaxonRef}
            selectTaxonRef={this.props.selectTaxonRef}
            navigateToTaxonRef={this.props.navigateToTaxonRef}
            fetchChildren={this.fetchChildren.bind(this)}
        />;
    }

    renderError(db: TaxonDBStateError) {
        return <Alert type="error" message={db.error.message} />;
    }

    renderTest() {
        return "test";
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case (DBStatus.ERROR):
                return this.renderError(db);
            default:
                // return this.renderTest()
                return this.renderSuccess(db);
        }
    }
}
