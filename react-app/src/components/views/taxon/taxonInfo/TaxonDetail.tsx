import React from 'react';
import { Taxon, NCBITaxon, GTDBTaxon, RDPTaxon, SILVATaxon } from '../../../../types/taxonomy';
import TaxonDetailNCBI from './TaxonDetailNCBI';
import TaxonDetailGTDB from './TaxonDetailGTDB';

import { Alert } from 'antd';
import TaxonDetailRDP from './TaxonDetailRDP';
import TaxonDetailSILVA from './TaxonDetailSILVA';

export interface TaxonDetailProps {
    taxon: Taxon;
}

interface TaxonDetailState { }

export default class TaxonDetail extends React.Component<TaxonDetailProps, TaxonDetailState> {
    render() {
        const taxon = this.props.taxon;
        switch (taxon.ref.namespace) {
            case 'ncbi_taxonomy':
                // TODO: why does this not prove to TS that we have a NCBITaxon?
                return <TaxonDetailNCBI taxon={taxon as NCBITaxon} />;
            case 'gtdb':
                return <TaxonDetailGTDB taxon={taxon as GTDBTaxon} />;
            case 'rdp_taxonomy':
                return <TaxonDetailRDP taxon={taxon as RDPTaxon} />;
            case 'silva_taxonomy':
                return <TaxonDetailSILVA taxon={taxon as SILVATaxon} />;
            default:
                return <Alert type="error" message="This taxon type is not supported" />;
        }
    }
}
