import React from 'react';
import { DBCollectionStatus } from '../../../../../lib/DB2';

import { AppConfig } from '@kbase/ui-components';
import LinkedData from './view';
import { TaxonomyReference } from '../../../../../types/taxonomy';
import LinkedDataDB, { SortSpec } from './LinkedDataDB';

export interface Props {
    token: string;
    config: AppConfig;
    taxonRef: TaxonomyReference;
}

interface State { }

export default class Data extends React.Component<Props, State> {
    db: LinkedDataDB;
    lastTaxonRef: TaxonomyReference;
    constructor(props: Props) {
        super(props);
        this.db = new LinkedDataDB({
            onUpdate: () => {
                this.forceUpdate();
            },
            initialData: {
                linkedObjectsCollection: {
                    status: DBCollectionStatus.NONE
                }
            },
            token: props.token,
            config: props.config
        });
        this.lastTaxonRef = props.taxonRef;
    }

    componentDidUpdate() {
        if (this.lastTaxonRef !== this.props.taxonRef) {
            this.lastTaxonRef = this.props.taxonRef;
            this.db.fetchLinkedObjects({ taxonRef: this.props.taxonRef, page: 1, pageSize: 12 });
        }
    }

    fetchLinkedObjects(page: number, pageSize: number) {
        return this.db.fetchLinkedObjects({ taxonRef: this.props.taxonRef, page, pageSize });
    }

    queryLinkedObjects(page: number, pageSize: number, sort: SortSpec | null) {
        return this.db.queryLinkedObjects({ taxonRef: this.props.taxonRef, page, pageSize, sort });
    }

    // renderNone() {
    //     return <Icon type="loading" />;
    // }

    // renderLoading() {
    //     return <Icon type="loading" />;
    // }

    // renderError(db: LinkedDataDBStateError) {
    //     return (
    //         <ErrorView error={db.error} />
    //     )
    // }

    // renderLoaded(db: LinkedDataDBStateLoaded) {
    //     return <LinkedData linkedObjects={db.linkedObjects} fetchLinkedObjects={this.fetchLinkedObjects.bind(this)} />;
    // }

    // componentDidMount() {
    //     const db = this.db.get();
    //     switch (db.status) {
    //         case DBStatus.NONE:
    //             this.db.fetchLinkedObjects({ taxonRef: this.props.taxonRef, page: 1, pageSize: 1000 });
    //     }
    // }

    // componentDidUpdate(prevProps: Props) {
    //     if (prevProps.taxonRef.id !== this.props.taxonRef.id ||
    //         prevProps.taxonRef.namespace !== this.props.taxonRef.namespace ||
    //         prevProps.taxonRef.timestamp !== this.props.taxonRef.timestamp) {

    //         this.db.fetchLinkedObjects({ taxonRef: this.props.taxonRef, page: 1, pageSize: 1000 });
    //     }
    // }

    render() {
        const db = this.db.get();
        return <LinkedData
            linkedObjectsCollection={db.linkedObjectsCollection}
            updateView={this.queryLinkedObjects.bind(this)}
            setPage={this.fetchLinkedObjects.bind(this)} />;
        // this.renderLoaded(db);
        // switch (db.status) {
        //     case DBStatus.NONE:
        //         // this.db.fetchLinkedObjects({ taxonRef: this.props.taxonRef, page: 1, pageSize: 1000 });
        //         return this.renderNone();
        //     case DBStatus.LOADING:
        //         return this.renderLoading();
        //     case DBStatus.ERROR:
        //         return this.renderError(db);
        //     case DBStatus.LOADED:
        //         return this.renderLoaded(db);
        // }
    }
}
