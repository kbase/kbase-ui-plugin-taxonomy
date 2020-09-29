import React from 'react';
import { SILVATaxon } from '../../../../types/taxonomy';

export interface TaxonDetailProps {
    taxon: SILVATaxon;
}

interface TaxonDetailState { }

export default class TaxonDetailSILVA extends React.Component<TaxonDetailProps, TaxonDetailState> {
    renderDatasets() {
        return this.props.taxon.datasets.map((dataset) => {
            return <div>
                {dataset}
            </div>;
        });
    }
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
                <div className="InfoTable-row" key="rank">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Datasets
                    </div>
                    <div className="InfoTable-dataCol">{this.renderDatasets()}</div>
                </div>
                <div className="InfoTable-row" key="rank">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Sequence
                    </div>
                    <div className="InfoTable-dataCol" style={{ height: '10em', overflowY: 'scroll', wordBreak: 'break-all' }}>{this.props.taxon.sequence}</div>
                </div>
            </div>
        );
    }

    render() {
        return <div>{this.renderTaxonDetail()}</div>;
    }
}
