import React from 'react';

import Wikipedia from '../../../components/Wikipedia';
import { Taxon } from '../../../types/taxonomy';

export interface TaxonDescriptionProps {
    taxon: Taxon;
}

interface TaxonDescriptionState { }

export class TaxonDescription extends React.Component<TaxonDescriptionProps, TaxonDescriptionState> {
    constructor(props: TaxonDescriptionProps) {
        super(props);
    }

    render() {
        return <Wikipedia term={this.props.taxon.name} />;
    }
}
