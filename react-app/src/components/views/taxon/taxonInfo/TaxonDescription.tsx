import React from 'react';
import { Taxon } from '../../../../types/taxonomy';
import Wikipedia from '../../../Wikipedia';

export interface TaxonDescriptionProps {
    taxon: Taxon;
}

interface TaxonDescriptionState { }

export default class TaxonDescription extends React.Component<TaxonDescriptionProps, TaxonDescriptionState> {
    // renderTaxonDescription() {
    //     return <Wikipedia term={this.props.taxon.name} />;
    // }

    /**
     * Intercept nodes which don't have a widely known biological association with
     * the node name ("scientific name"), and for which a wikipedia lookup would not
     * be very useful.
     */
    render() {
        switch (this.props.taxon.name) {
            case 'root':
                return (
                    <div>
                        <p>This taxon is the topmost node in the taxonomy tree.</p>
                    </div>
                );
            case 'cellular organisms':
                return (
                    <div>
                        <p>This taxon represents all cellular organisms.</p>
                    </div>
                );
            default:
                return <Wikipedia term={this.props.taxon.name} />;
        }
    }

    // render() {
    //     if (this.props.taxon.isBiological) {
    //         return <div className="Col scrollable">{this.renderTaxonDescription()}</div>;
    //     }
    //     return this.notBiological();
    // }
}
