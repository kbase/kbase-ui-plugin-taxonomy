import React from 'react';
import { Taxon, TaxonomyReference } from '../../../types/taxonomy';
import './LineageNavigator.css';
import TaxonItem from './TaxonItem';
import TaxonChildren from './taxonChildren';
import Lineage from './lineage';

export interface LineageProps {
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
    selectTaxonRef: (ref: TaxonomyReference) => void;
    navigateToTaxonRef: (ref: TaxonomyReference) => void;
}

interface LineageState { }

export default class LineageNavigator extends React.Component<LineageProps, LineageState> {
    onClick(ref: TaxonomyReference) {
        this.props.selectTaxonRef(ref);
        // alert('navigate to ' + taxonId);
    }

    // menuSelected(param: SelectParam) {
    //     this.props.selectTaxonRef(param.key);
    //     // alert('navigate to ' + param.key);
    // }

    clickTaxon(taxon: Taxon) {
        this.props.selectTaxonRef(taxon.ref);
    }

    renderLineage() {
        return (
            <Lineage
                taxonRef={this.props.targetTaxon.ref}
                selectedTaxonRef={this.props.selectedTaxon.ref}
                selectTaxonRef={this.props.selectTaxonRef}
                navigateToTaxonRef={this.props.navigateToTaxonRef}
            />
        );
        // return 'disabled';
    }

    renderChildrenCount(count: number) {
        if (count === 0) {
            return <div className="">No children</div>;
        }
        if (count === 1) {
            return <div>One child</div>;
        }
        return (
            <div>
                {Intl.NumberFormat('en-US', {
                    useGrouping: true
                }).format(count)}{' '}
                children
            </div>
        );
    }

    renderChildren() {
        let selectedRef: TaxonomyReference | null;
        if (this.props.selectedTaxon) {
            selectedRef = this.props.selectedTaxon.ref;
        } else {
            selectedRef = null;
        }

        return (
            <TaxonChildren
                taxonRef={this.props.targetTaxon.ref}
                selectedTaxonRef={selectedRef}
                selectTaxonRef={this.props.selectTaxonRef}
                navigateToTaxonRef={this.props.navigateToTaxonRef}
            />
        );
    }

    // renderChildrenxscrolling() {
    //     let selectedId;
    //     if (this.props.selectedTaxon) {
    //         selectedId = this.props.selectedTaxon.id;
    //     } else {
    //         selectedId = null;
    //     }

    //     return (
    //         <div className="scrolling">
    //             <TaxonList
    //                 taxa={this.props.offspring}
    //                 selectedTaxonID={selectedId}
    //                 selectTaxonID={this.props.selectTaxonID}
    //                 navigateToTaxonID={this.props.navigateToTaxonID}
    //                 totalItems={this.props.totalOffspring}
    //                 maxItems={10}
    //             />
    //         </div>
    //     );
    // }

    renderTargetTaxon() {
        const isActive =
            this.props.selectedTaxon &&
            this.props.selectedTaxon.ref.id === this.props.targetTaxon.ref.id &&
            this.props.selectedTaxon.ref.timestamp === this.props.targetTaxon.ref.timestamp;

        return (
            <TaxonItem
                taxon={this.props.targetTaxon}
                isActive={isActive}
                selectTaxonRef={this.props.selectTaxonRef}
                navigateToTaxonRef={this.props.navigateToTaxonRef}
            />
        );
    }

    render() {
        return (
            <div className="Col scrollable" style={{ overflowY: 'auto' }}>
                <div className="Col-auto Nav-box">
                    <div className="Nav-box-title">Lineage</div>
                    {this.renderLineage()}
                </div>
                <div className="Col-auto Nav-box Lineage-target-taxon">{this.renderTargetTaxon()}</div>
                <div className="Col-auto scrollable Nav-box">{this.renderChildren()}</div>
            </div>
        );
    }
}
