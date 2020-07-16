import React, { CSSProperties } from 'react';
import { Taxon } from '../../../types/taxonomy';

export interface Props {
    taxon: Taxon;
}

export interface State { }

export default class TaxonSummary extends React.Component<Props, State> {
    render() {
        let nameStyle: CSSProperties = {};
        if (this.props.taxon.rank === 'species') {
            nameStyle = { fontStyle: 'italic' };
        }
        return (
            <div className="InfoTable">
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                        Name
                    </div>
                    <div className="InfoTable-dataCol" style={nameStyle}>
                        {this.props.taxon.name}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                        Rank
                    </div>
                    <div className="InfoTable-dataCol">{this.props.taxon.rank}</div>
                </div>
            </div>
        );
    }
}
