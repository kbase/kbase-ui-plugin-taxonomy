import React from 'react';
import { Pagination, Input, Spin } from 'antd';
import TaxonList from '../TaxonList';
import { TaxonomyReference } from '../../../../types/taxonomy';
import { TaxonDBState, TaxonDBStateError, TaxonDBStateLoaded, TaxonDBStateReLoading } from './TaxonChildrenDB';
import { DBStatus } from '../../../../lib/DB';
import './index.css';
import ErrorView from '../../../../ui/ErrorView';


const DEFAULT_PAGE_SIZE = 10;

export interface Props {
    db: TaxonDBState;
    taxonRef: TaxonomyReference;
    selectedTaxonRef: TaxonomyReference | null;
    // taxa: Array<Taxon>;
    // total: number;
    selectTaxonRef: (taxonRef: TaxonomyReference) => void;
    navigateToTaxonRef: (taxonRef: TaxonomyReference) => void;
    fetchChildren: (taxonRef: TaxonomyReference, page: number, pageSize: number, searchTerm: string) => void;
}

export interface State { }

export default class TaxonChildren extends React.Component<Props, State> {
    searchTerm: string;
    page: number;
    pageSize: number | null;
    constructor(props: Props) {
        super(props);
        this.searchTerm = '';
        this.page = 1;
        this.pageSize = null;
    }
    componentDidMount() {
        this.props.fetchChildren(this.props.taxonRef, 1, DEFAULT_PAGE_SIZE, '');
    }
    renderTaxaNone() {
        return <div>None</div>;
    }
    renderTaxaLoading() {
        return <Spin />;
    }

    renderTitleLoaded(db: TaxonDBStateLoaded | TaxonDBStateReLoading) {
        if (db.total === 0) {
            return <div className="Col-auto TaxonChildren-box-title">No Children</div>;
        }

        const totalCount = Intl.NumberFormat('en-US', {
            useGrouping: true
        }).format(db.total);
        const currentItem = (db.page - 1) * db.pageSize + 1;
        const lastItem = currentItem + db.taxa.length - 1;

        return (
            <div className="Col-auto TaxonChildren-box-title">
                Children ({currentItem}-{lastItem} of {totalCount})
            </div>
        );
    }

    renderTitleReLoading(db: TaxonDBStateReLoading) {
        return <Spin size="small">{this.renderTitleLoaded(db)}</Spin>;
    }

    renderTitle() {
        const db = this.props.db;
        switch (db.status) {
            case DBStatus.NONE:
            case DBStatus.LOADING:
                return <div>Loading...</div>;
            case DBStatus.ERROR:
                return <ErrorView error={db.error} />;
            case DBStatus.LOADED:
                return this.renderTitleLoaded(db);
            case DBStatus.RELOADING:
                return this.renderTitleReLoading(db);
        }
    }
    doSearch(term: string) {
        this.searchTerm = term;
        this.props.fetchChildren(this.props.taxonRef, 1, this.pageSize || DEFAULT_PAGE_SIZE, term);
    }
    renderSearch() {
        const disabled =
            this.props.db.status !== DBStatus.LOADED ||
            (this.props.db.total <= this.props.db.pageSize && !this.searchTerm);
        return (
            <div style={{ marginBottom: '4px' }}>
                <Input.Search placeholder="Search Children" onSearch={this.doSearch.bind(this)} disabled={disabled} />
            </div>
        );
    }
    renderTaxaLoaded(db: TaxonDBStateLoaded | TaxonDBStateReLoading) {
        return (
            <React.Fragment>
                <TaxonList
                    taxa={db.taxa}
                    selectedTaxonRef={this.props.selectedTaxonRef}
                    selectTaxonRef={this.props.selectTaxonRef}
                    navigateToTaxonRef={this.props.navigateToTaxonRef}
                    totalItems={db.total}
                    maxItems={DEFAULT_PAGE_SIZE}
                />
            </React.Fragment>
        );
    }
    renderTaxaReLoading(db: TaxonDBStateReLoading) {
        return <Spin tip="Loading">{this.renderTaxaLoaded(db)}</Spin>;
    }
    renderTaxaError(db: TaxonDBStateError) {
        return <ErrorView error={db.error} />;
    }
    renderTaxa() {
        switch (this.props.db.status) {
            case DBStatus.NONE:
                return this.renderTaxaNone();
            case DBStatus.LOADING:
                return this.renderTaxaLoading();
            case DBStatus.LOADED:
                return this.renderTaxaLoaded(this.props.db);
            case DBStatus.RELOADING:
                return this.renderTaxaReLoading(this.props.db);
            case DBStatus.ERROR:
                return this.renderTaxaError(this.props.db);
        }
    }
    changePage(page: number, pageSize: number | undefined) {
        this.page = page;
        this.pageSize = pageSize || DEFAULT_PAGE_SIZE;
        this.props.fetchChildren(this.props.taxonRef, this.page, this.pageSize, this.searchTerm);
    }
    renderPaginationNone() {
        return <Pagination size="small" showLessItems={true} hideOnSinglePage={false} />;
    }
    renderPaginationLoading() {
        return <Pagination size="small" showLessItems={true} hideOnSinglePage={false} />;
    }
    renderPaginationError() {
        return <Pagination size="small" showLessItems={true} hideOnSinglePage={false} />;
    }
    renderPaginationLoaded(db: TaxonDBStateLoaded) {
        return (
            <Pagination
                size="small"
                defaultPageSize={db.pageSize}
                // defaultCurrent={1}
                showLessItems={true}
                current={db.page}
                hideOnSinglePage={false}
                total={db.total}
                onChange={this.changePage.bind(this)}
            />
        );
    }
    renderPaginationReLoading(db: TaxonDBStateReLoading) {
        return (
            <Pagination
                size="small"
                defaultPageSize={db.pageSize}
                // defaultCurrent={1}
                showLessItems={true}
                current={db.page}
                hideOnSinglePage={false}
                total={db.total}
                disabled={true}
            />
        );
    }
    renderPagination() {
        const db = this.props.db;
        switch (db.status) {
            case DBStatus.NONE:
                return this.renderPaginationNone();
            case DBStatus.LOADING:
                return this.renderPaginationLoading();
            case DBStatus.ERROR:
                return this.renderPaginationError();
            case DBStatus.LOADED:
                return this.renderPaginationLoaded(db);
            case DBStatus.RELOADING:
                return this.renderPaginationReLoading(db);
        }
    }
    renderChildren() {
        return (
            <div className="TaxonChildren">
                {this.renderTitle()}
                {this.renderSearch()}
                {this.renderPagination()}
                {this.renderTaxa()}
            </div>
        );
    }

    render() {
        return this.renderChildren();
    }
}
