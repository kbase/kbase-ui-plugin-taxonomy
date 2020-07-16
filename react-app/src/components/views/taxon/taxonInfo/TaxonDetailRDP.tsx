import React from 'react';
import { RDPTaxon } from '../../../../types/taxonomy';

export interface TaxonDetailProps {
    taxon: RDPTaxon;
}

interface TaxonDetailState { }

export default class TaxonDetailRDP extends React.Component<TaxonDetailProps, TaxonDetailState> {
    renderTaxonDetail() {
        const width = '8em';
        let nameStyle: React.CSSProperties = {};
        if (this.props.taxon.rank === 'species') {
            nameStyle.fontStyle = 'italic';
        }
        return (
            <div className="InfoTable">
                <div className="InfoTable-row" key="name">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Name
                    </div>
                    <div className="InfoTable-dataCol" style={nameStyle}>
                        {this.props.taxon.name}
                    </div>
                </div>
                <div className="InfoTable-row" key="rank">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Rank
                    </div>
                    <div className="InfoTable-dataCol">{this.props.taxon.rank}</div>
                </div>
            </div>
        );
    }

    render() {
        return <div>{this.renderTaxonDetail()}</div>;
    }
}
