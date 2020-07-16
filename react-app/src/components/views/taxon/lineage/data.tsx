import React from 'react';
import LineageDB, { LineageDBStateLoaded } from './LineageDB';
import { DBStatus, DBStateError } from '../../../../lib/DB';

import { AppConfig } from '@kbase/ui-components';
import Lineage from './Lineage';
import { TaxonomyReference } from '../../../../types/taxonomy';
import ErrorView from '../../../../ui/ErrorView';
import { Spin } from 'antd';

export interface Props {
    token: string;
    config: AppConfig;
    taxonRef: TaxonomyReference;
    selectedTaxonRef: TaxonomyReference;
    selectTaxonRef: (taxonRef: TaxonomyReference) => void;
    navigateToTaxonRef: (taxonRef: TaxonomyReference) => void;
}

interface State { }

export default class Data extends React.Component<Props, State> {
    db: LineageDB;
    constructor(props: Props) {
        super(props);
        this.db = new LineageDB({
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
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                this.db.getLineage(this.props.taxonRef);
        }
    }

    componentWillUnmount() {
        // this.db.stop();
    }

    renderLoading() {
        return <Spin />;
    }

    renderError(db: DBStateError) {
        return <ErrorView error={db.error} />;
    }

    renderLoaded(db: LineageDBStateLoaded) {
        return (
            <Lineage
                lineage={db.lineage}
                selectedTaxonRef={this.props.selectedTaxonRef}
                selectTaxonRef={this.props.selectTaxonRef}
                navigateToTaxonRef={this.props.navigateToTaxonRef}
            />
        );
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                // this.db.getLineage(this.props.taxonRef);
                return this.renderLoading();
            case DBStatus.LOADING:
                return this.renderLoading();
            case DBStatus.ERROR:
                return this.renderError(db);
            case DBStatus.LOADED:
                return this.renderLoaded(db);
        }
    }
}
