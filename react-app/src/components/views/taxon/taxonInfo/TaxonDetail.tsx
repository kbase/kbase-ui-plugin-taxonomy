import { Table } from 'antd';
import React from 'react';
import { Source } from '../../../../lib/TaxonomyAPIClient';
import {
    Taxon, TaxonAlias, TaxonMetadata, TaxonMetadataArrayOfAlias, TaxonMetadataArrayOfString,
    TaxonMetadataBoolean, TaxonMetadataNumber, TaxonMetadataSequence, TaxonMetadataString
} from '../../../../types/taxonomy';
import { na } from '../../../../ui/content';

export interface TaxonDetailProps {
    taxon: Taxon;
    source: Source;
}

interface TaxonDetailState { }

const width = '8em';

export default class TaxonDetail extends React.Component<TaxonDetailProps, TaxonDetailState> {

    renderMetadatumString(metadatum: TaxonMetadataString) {
        return <div>
            {metadatum.value}
        </div>;
    }

    renderSequenceColored(sequence: string) {
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
        const coloredSequence = sequence.split('').map((char, index) => {
            return <span style={{ color: colors[char] }} key={index} >
                {char}
            </span>;
        });
        return <div className="InfoTable-dataCol" style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {coloredSequence}
        </div>;
    }

    renderMetadatumSequence(metadatum: TaxonMetadataSequence) {
        if (metadatum.value === null) {
            return na();
        }
        return <div>
            {this.renderSequenceColored(metadatum.value)}
        </div>;
    }

    renderMetadatumNumber(metadatum: TaxonMetadataNumber) {
        if (metadatum.value === null) {
            return na();
        }
        return <div>
            {metadatum.value}
        </div>;
    }

    renderMetadatumBoolean(metadatum: TaxonMetadataBoolean) {
        if (metadatum.value === null) {
            return na();
        }
        return <div>
            {metadatum.value ? 'Yes' : 'No'}
        </div>;
    }

    renderMetadatumArrayOfString(metadatum: TaxonMetadataArrayOfString) {
        if (metadatum.value === null) {
            return na();
        }
        return metadatum.value.map((item) => {
            return <div key={item}>
                {item}
            </div>;
        });
    }

    renderMetadatumArrayOfAlias(metadatum: TaxonMetadataArrayOfAlias) {
        if (metadatum.value === null) {
            return na();
        }
        const aliasNameSorter = (a: TaxonAlias, b: TaxonAlias) => {
            return stringSorter(a.name, b.name);
        };

        const aliasCategorySorter = (a: TaxonAlias, b: TaxonAlias) => {
            return stringSorter(a.category, b.category);
        };

        const stringSorter = (a: string, b: string) => {
            const fixedA = a.replace(/^["']/, '');
            const fixedB = b.replace(/^["']/, '');
            return fixedA.localeCompare(fixedB);
        };
        return (
            <Table
                dataSource={metadatum.value}
                className="KBaseAntdOverride-remove-table-border"
                size="small"
                // pagination={{ position: 'top' }}
                pagination={false}
                scroll={{ y: '25em' }}
                rowKey="name"
                bordered={false}
            >
                <Table.Column
                    title="Name"
                    dataIndex="name"
                    key="name"
                    defaultSortOrder="ascend"
                    sorter={aliasNameSorter}
                />
                <Table.Column
                    title="Category"
                    dataIndex="category"
                    key="category"
                    width="20em"
                    sorter={aliasCategorySorter}
                />
            </Table>
        );
    }

    renderMetadataValue(metadatum: TaxonMetadata) {
        switch (metadatum.type) {
            case 'string':
                return this.renderMetadatumString(metadatum);
            case 'number':
                return this.renderMetadatumNumber(metadatum);
            case 'boolean':
                return this.renderMetadatumBoolean(metadatum);
            case 'array<string>':
                return this.renderMetadatumArrayOfString(metadatum);
            case 'array<alias>':
                return this.renderMetadatumArrayOfAlias(metadatum);
            case 'sequence':
                return this.renderMetadatumSequence(metadatum);
        }
    }

    renderMetadata() {
        const metadata = this.props.taxon.metadata;

        if (metadata.length === 0) {
            return <div style={{ fontStyle: 'italic' }}>
                No metadata available for {this.props.source.title} taxa
            </div>;
        }

        return metadata.map((metadatum) => {
            const value = this.renderMetadataValue(metadatum);
            return <div className="InfoTable-row" key={metadatum.id}>
                <div className="InfoTable-labelCol" style={{ width }}>
                    {metadatum.label}
                </div>
                <div className="InfoTable-dataCol">{value}</div>
            </div>;
        });
    }

    render() {

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
                <div className="InfoTable-row -section" key="metadata-header" style={{ marginTop: '20px' }}>
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Metadata
                    </div>
                    <div className="InfoTable-dataCol"></div>
                </div>
                {this.renderMetadata()}

            </div>
        );
    }
}
