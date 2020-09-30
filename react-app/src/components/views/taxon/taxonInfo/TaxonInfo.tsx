import React from 'react';
import { Tabs } from 'antd';
import TaxonDetail from './TaxonDetail';
import TaxonDescription from './TaxonDescription';
import LinkedData from './linkedData';
import { Taxon } from '../../../../types/taxonomy';
import { Source } from '../../../../lib/TaxonomyAPIClient';


export interface TaxonInfoProps {
    taxon: Taxon;
    source: Source;
}

interface TaxonInfoState { }

export default class TaxonInfo extends React.Component<TaxonInfoProps, TaxonInfoState> {
    render() {
        return (
            <Tabs defaultActiveKey="detail" animated={false} className="FullHeight-tabs" type="card">
                <Tabs.TabPane tab="Detail" key="detail" forceRender={false}>
                    <div className="Col" style={{ overflowY: 'auto' }}>
                        <TaxonDetail taxon={this.props.taxon} source={this.props.source} />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Description" key="description" forceRender={false}>
                    <TaxonDescription taxon={this.props.taxon} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Linked Data" key="linkedData" forceRender={false}>
                    <div className="Col" style={{ overflowY: 'auto' }}>
                        <LinkedData taxonRef={this.props.taxon.ref} />
                    </div>
                </Tabs.TabPane>
            </Tabs>
        );
    }
}
