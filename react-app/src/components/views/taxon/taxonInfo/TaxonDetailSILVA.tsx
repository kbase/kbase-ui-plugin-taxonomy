import React from 'react';
import { SILVATaxon } from '../../../../types/taxonomy';

export interface TaxonDetailProps {
    taxon: SILVATaxon;
}

interface TaxonDetailState { }

export default class TaxonDetailSILVA extends React.Component<TaxonDetailProps, TaxonDetailState> {
    renderDatasets() {
        if (!this.props.taxon.datasets) {
            return <div>-</div>;
        }
        return this.props.taxon.datasets.map((dataset) => {
            return <div>
                {dataset}
            </div>;
        });
    }

    renderSequence() {
        if (!this.props.taxon.sequence) {
            return <div>-</div>;
        }
        return <div className="InfoTable-dataCol" style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {this.props.taxon.sequence}
        </div>;
    }
    renderSequenceColored() {
        if (!this.props.taxon.sequence) {
            return <div>-</div>;
        }
        // see DRuMS Color Schemes: https://www.umass.edu/molvis/drums/nochime/1152/fs.html
        const colors: {
            [char: string]: string;
        } = {
            A: '#5050ff',
            T: '#e6e600',
            G: '#00c000',
            C: '#e00000',
            U: '#cc9900'
        };
        const coloredSequence = this.props.taxon.sequence.split('').map((char) => {
            return <span style={{ color: colors[char] }}>
                {char}
            </span>;
        });
        return <div className="InfoTable-dataCol" style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {coloredSequence}
        </div>;
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
                    <div className="InfoTable-dataCol">{this.renderSequenceColored()}</div>
                </div>
            </div>
        );
    }

    render() {
        return <div>{this.renderTaxonDetail()}</div>;
    }
}
