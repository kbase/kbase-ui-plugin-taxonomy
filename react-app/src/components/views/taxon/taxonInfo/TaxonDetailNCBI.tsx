import React from 'react';
import { NCBITaxon, TaxonAlias } from '../../../../types/taxonomy';
import { Table } from 'antd';
import geneticCodes from '../data/geneticCodes.json';

// as Array<[number, string]>

type GeneticCodes = Array<[number, string]>;

function ensureGeneticCodes(geneticCodes: any): GeneticCodes {
    if (!(geneticCodes instanceof Array)) {
        throw new Error('Invalid genetic codes file!');
    }

    return geneticCodes.map(([id, name]) => {
        if (typeof id !== 'number') {
            throw new Error('Invalid genetic code id in file');
        }
        if (typeof name !== 'string') {
            throw new Error('Invalid genetic code label in file');
        }
        return [id, name];
    });
}

const gc = ensureGeneticCodes(geneticCodes);

const geneticCodesMap: Map<number, string> = gc.reduce((geneticCodesMap, [id, label]) => {
    geneticCodesMap.set(id, label);
    return geneticCodesMap;
}, new Map<number, string>());

export interface TaxonDetailProps {
    taxon: NCBITaxon;
}

interface TaxonDetailState { }

export default class TaxonDetailNCBI extends React.Component<TaxonDetailProps, TaxonDetailState> {
    renderAliases() {
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
                dataSource={this.props.taxon.aliases}
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
                <div className="InfoTable-row" key="ncbiid">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        NCBI ID
                    </div>
                    <div className="InfoTable-dataCol">
                        <a
                            href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=info&id=${
                                this.props.taxon.ncbiID
                                }`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {this.props.taxon.ncbiID}
                        </a>
                    </div>
                </div>
                <div className="InfoTable-row" key="genetic-code">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Genetic Code
                    </div>
                    <div className="InfoTable-dataCol">
                        {this.props.taxon.geneticCode} -{' '}
                        {geneticCodesMap.get(this.props.taxon.geneticCode) || 'Unknown'}
                    </div>
                </div>
                <div className="InfoTable-row" key="aliases">
                    <div className="InfoTable-labelCol" style={{ width }}>
                        Aliases
                    </div>
                    <div className="InfoTable-dataCol">{this.renderAliases()}</div>
                </div>
            </div>
        );
    }

    render() {
        return <div>{this.renderTaxonDetail()}</div>;
    }
}
