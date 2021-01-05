import React from 'react';
import { Taxon, TaxonomyReference } from '../../../types/taxonomy';
import './TaxonList.css';
import TaxonItem from './TaxonItem';
import { Empty } from 'antd';

export interface Noun {
    singular: string,
    plural: string;
}
export interface Props {
    taxa: Array<Taxon>;
    maxItems: number;
    totalItems: number;
    selectedTaxonRef: TaxonomyReference | null;
    itemNoun: Noun;
    selectTaxonRef: (ref: TaxonomyReference) => void;
    navigateToTaxonRef: (ref: TaxonomyReference) => void;
}

interface State { }

export default class TaxonList extends React.Component<Props, State> {
    selectTaxon(ref: TaxonomyReference) {
        this.props.selectTaxonRef(ref);
    }
    navigateToTaxon(ref: TaxonomyReference) {
        this.props.navigateToTaxonRef(ref);
    }
    renderItemsPlain() {
        return this.props.taxa.map((taxon, index) => {
            const isActive = this.props.selectedTaxonRef !== null &&
                this.props.selectedTaxonRef.id === taxon.ref.id;
            return (
                <TaxonItem
                    taxon={taxon}
                    isActive={isActive}
                    selectTaxonRef={this.selectTaxon.bind(this)}
                    key={String(index)}
                    navigateToTaxonRef={this.navigateToTaxon.bind(this)}
                />
            );
        });
    }
    renderNoItems() {
        return <Empty description={`No ${this.props.itemNoun.plural}`} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    render() {
        if (this.props.taxa.length === 0) {
            return this.renderNoItems();
        }
        return this.renderItemsPlain();
    }
}
