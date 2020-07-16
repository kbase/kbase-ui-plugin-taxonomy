import React from 'react';

import { SourceInfo } from '../SourceInfo';
import LineageNavigator from '../LineageNavigator';
import TaxonSummary from '../TaxonSummary';
import { Taxon, TaxonomyReference } from '../../../../types/taxonomy';
import { Row, Col } from 'antd';
import TaxonInfo from '../taxonInfo/TaxonInfo';
import './Taxonomy.css';
import { DataSourceInfo } from '../../../../lib/RelationEngineAPIClient';


export interface TaxonomyProps {
    // lineage: Array<Taxon>;
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
    dataSource: DataSourceInfo;
    selectTaxonRef: (taxonRef: TaxonomyReference) => void;
    navigateToTaxonRef: (taxonRef: TaxonomyReference) => void;
    setTitle: (title: string) => void;
}

interface TaxonomyState { }

export default class Taxonomy extends React.Component<TaxonomyProps, TaxonomyState> {
    renderTaxonInfo() {
        if (!this.props.selectedTaxon) {
            return <div>No taxon selected</div>;
        }
        return <TaxonInfo taxon={this.props.selectedTaxon} />;
        // return 'disabled';
    }

    componentDidMount() {
        this.props.setTitle('Taxonomy Landing Page for "' + this.props.targetTaxon.name + '"');
    }

    render() {
        return (
            <div className="Col scrollable Taxonomy">
                <div className="Col-auto Taxonomy-summary-section">
                    <Row>
                        <Col span={12}>
                            <TaxonSummary taxon={this.props.targetTaxon} />
                        </Col>
                        <Col span={12}>
                            <SourceInfo dataSource={this.props.dataSource} />
                        </Col>
                    </Row>
                </div>
                <div className="Row scrollable">
                    <div className="Col scrollable" style={{ flex: '0 0 20em' }}>
                        <LineageNavigator
                            selectedTaxon={this.props.selectedTaxon}
                            // lineage={this.props.lineage}
                            selectTaxonRef={this.props.selectTaxonRef}
                            targetTaxon={this.props.targetTaxon}
                            navigateToTaxonRef={this.props.navigateToTaxonRef}
                        />
                    </div>

                    <div className="Col scrollable" style={{ marginLeft: '10px' }}>
                        {this.renderTaxonInfo()}
                    </div>
                </div>
            </div>
        );
    }
}
