import React from 'react';
import { RDPTaxon } from '../../../../types/taxonomy';
import { na } from '../../../../ui/content';

export interface TaxonDetailProps {
    taxon: RDPTaxon;
}

interface TaxonDetailState { }

export default class TaxonDetailRDP extends React.Component<TaxonDetailProps, TaxonDetailState> {
    renderBoolean(value: boolean | null): JSX.Element {
        if (value === null) {
            return na();
        }
        if (value) {
            return <span>Yes</span>;
        }
        return <span>No</span>;

    }
    renderNullable(value: string | null): JSX.Element {
        if (value === null) {
            return na();
        }
        return <span>{value}</span>;
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
                <div className="InfoTable-header" key="rank">
                    RDP
                </div>
                <div className="InfoTable-row" key="incertae_sedis">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Incertae Sedis
                    </div>
                    <div className="InfoTable-dataCol">{this.renderBoolean(this.props.taxon.incertae_sedis)}</div>
                </div>
                <div className="InfoTable-row" key="unclassified">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Unclassified
                    </div>
                    <div className="InfoTable-dataCol">{this.renderBoolean(this.props.taxon.unclassified)}</div>
                </div>
                <div className="InfoTable-row" key="molecule">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Molecule
                    </div>
                    <div className="InfoTable-dataCol">{this.renderNullable(this.props.taxon.molecule)}</div>
                </div>
            </div>
        );
    }

    render() {
        return <div>{this.renderTaxonDetail()}</div>;
    }
}
