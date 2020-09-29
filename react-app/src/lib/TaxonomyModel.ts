import { TaxonomyReference, Taxon, NCBITaxon, GTDBTaxon, RDPTaxon, SILVATaxon } from '../types/taxonomy';
import TaxonomyAPIClient, { Namespace } from './TaxonomyAPIClient';
import { RelationEngineDataSourceId } from '../types/core';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';
import RelationEngineAPIClient, { DataSourceInfo } from './RelationEngineAPIClient';

// const INITIAL_BATCH_SIZE = 100;
// const BATCH_SIZE = 1000;
// const TOTAL_LIMIT = 10000;
// const PARALLELISM = 2;

export interface GetChildrenOptions {
    offset: number;
    limit: number;
    searchTerm: string;
}

export interface WorkspaceObjectType {
    module: string;
    name: string;
    majorVersion: number;
    minorVersion: number;
}

export enum WorkspaceType {
    UNKNOWN,
    NARRATIVE,
    REFDATA
}

export interface LinkedObject {
    linkedAt: number;
    workspaceID: number;
    objectID: number;
    version: number;
    objectName: string;
    workspaceUpdatedAt: number;
    createdAt: number;
    type: WorkspaceObjectType;
    workspaceType: WorkspaceType;
    title: string;
}

export interface GetLinkedObjectsOptions {
    offset: number;
    limit: number;
}

export interface GetLinkedObjectsResult {
    linkedObjects: Array<LinkedObject>;
    totalCount: number;
}

const REQUEST_TIMEOUT = 30000;

export interface TaxonomyModelParams {
    token: string;
    url: string;
    relationEngineURL: string;
    taxonomyAPIConfig: DynamicServiceConfig;
}

// export interface DataSourceInfo {
//     source: RelationEngineDataSource;
//     data_url: string;
//     home_url: string;
//     logo_url: string;
//     title: string;
// }

function namespaceToDataSourceId(namespace: Namespace): RelationEngineDataSourceId {
    switch (namespace) {
        case 'ncbi_taxonomy':
            return 'ncbi_taxonomy';
        case 'gtdb':
            return 'gtdb';
        case 'rdp_taxonomy':
            return 'rdp_taxonomy';
        case 'silva_taxonomy':
            return 'silva_taxonomy';
    }
}

export class TaxonomyModel {
    taxonomyClient: TaxonomyAPIClient;
    relationEngineClient: RelationEngineAPIClient;
    constructor({ token, url, relationEngineURL, taxonomyAPIConfig }: TaxonomyModelParams) {
        this.taxonomyClient = new TaxonomyAPIClient({
            token,
            url,
            timeout: REQUEST_TIMEOUT,
            version: taxonomyAPIConfig.version
        });
        this.relationEngineClient = new RelationEngineAPIClient({
            token: token,
            url: relationEngineURL,
            timeout: REQUEST_TIMEOUT
        });
    }

    async getLineage(taxonRef: TaxonomyReference): Promise<Array<Taxon>> {
        const {
            id, timestamp
        } = taxonRef;
        const result = await this.taxonomyClient.get_lineage({
            ns: taxonRef.namespace,
            id,
            ts: timestamp
        });
        // TODO: should be conditional based on the source of the taxonomy??

        switch (taxonRef.namespace) {
            case 'ncbi_taxonomy':
                const ncbiTaxons: Array<NCBITaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean;
                    if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                        isBiological = false;
                    } else {
                        isBiological = true;
                    }
                    return {
                        ref: {
                            namespace: 'ncbi_taxonomy',
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        ncbiID: taxonResult.ncbi_taxon_id!,
                        geneticCode: parseInt(taxonResult.gencode),
                        aliases: taxonResult.aliases.map(({ name, category }) => {
                            return {
                                name,
                                category
                            };
                        }),
                        isBiological
                    };
                });
                return ncbiTaxons;
            case 'gtdb':
                const gtdbTaxons: Array<GTDBTaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean;

                    // if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                    //     isBiological = false;
                    // } else {
                    //     isBiological = true;
                    // }
                    isBiological = true;
                    return {
                        ref: {
                            namespace: 'gtdb',
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological
                    };
                });
                return gtdbTaxons;
            case 'rdp_taxonomy':
                const rdpTaxon: Array<RDPTaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean;

                    // if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                    //     isBiological = false;
                    // } else {
                    //     isBiological = true;
                    // }
                    isBiological = true;
                    return {
                        ref: {
                            namespace: 'rdp_taxonomy',
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological,
                        incertae_sedis: taxonResult.incertae_sedis!,
                        molecule: taxonResult.molecule! || null,
                        unclassified: taxonResult.unclassified!
                    };
                });
                return rdpTaxon;
            case 'silva_taxonomy':
                const silvaTaxon: Array<SILVATaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean;
                    isBiological = true;
                    return {
                        ref: {
                            namespace: 'silva_taxonomy',
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological,
                        datasets: taxonResult.datasets!,
                        sequence: taxonResult.sequence!
                    };
                });
                return silvaTaxon;
            default:
                throw new Error('Not a supported taxonomy data source');
        }
    }

    async getChildren(taxonRef: TaxonomyReference, options: GetChildrenOptions): Promise<[Array<Taxon>, number]> {
        const {
            id, timestamp
        } = taxonRef;

        const result = await this.taxonomyClient.get_children({
            ns: taxonRef.namespace,
            id,
            ts: timestamp,
            offset: options.offset,
            limit: options.limit,
            searchTerm: options.searchTerm
        });

        switch (taxonRef.namespace) {
            case 'ncbi_taxonomy':
                const ncbiTaxa: Array<NCBITaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean;
                    if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                        isBiological = false;
                    } else {
                        isBiological = true;
                    }
                    return {
                        ref: {
                            namespace: taxonRef.namespace,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        ncbiID: taxonResult.ncbi_taxon_id!,
                        geneticCode: parseInt(taxonResult.gencode),
                        aliases: taxonResult.aliases.map(({ name, category }) => {
                            return {
                                name,
                                category
                            };
                        }),
                        isBiological
                    };
                });
                return [ncbiTaxa, result.total_count];
            case 'gtdb':
                const gtdbTaxa: Array<GTDBTaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean = true;
                    return {
                        ref: {
                            namespace: taxonRef.namespace,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological
                    };
                });
                return [gtdbTaxa, result.total_count];
            case 'rdp_taxonomy':
                const rdpTaxa: Array<RDPTaxon> = result.results.map((taxonResult) => {
                    let isBiological: boolean = true;
                    return {
                        ref: {
                            namespace: taxonRef.namespace,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological,
                        incertae_sedis: taxonResult.incertae_sedis!,
                        molecule: taxonResult.molecule! || null,
                        unclassified: taxonResult.unclassified!
                    };
                });
                return [rdpTaxa, result.total_count];
            case 'silva_taxonomy':
                const silvaTaxa: Array<SILVATaxon> = result.results.map((taxonResult) => {
                    return {
                        ref: {
                            namespace: taxonRef.namespace,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological: true,
                        datasets: taxonResult.datasets!,
                        sequence: taxonResult.sequence!
                    };
                });
                return [silvaTaxa, result.total_count];
            default:
                throw new Error('Not a supported taxonomy data source');
        }
    }

    async getTaxon(taxonRef: TaxonomyReference): Promise<Taxon> {
        const {
            id, timestamp
        } = taxonRef;

        const result = await this.taxonomyClient.get_taxon({
            ns: taxonRef.namespace,
            id,
            ts: timestamp
        });

        const taxonResult = result.results[0];

        // TODO: here and above, we need to determine the namespace enum value by 
        // comparing the string coming in...
        switch (taxonRef.namespace) {
            case 'ncbi_taxonomy':
                return (() => {
                    let isBiological: boolean;
                    if (taxonResult.scientific_name === 'root' || taxonResult.scientific_name === 'cellular organisms') {
                        isBiological = false;
                    } else {
                        isBiological = true;
                    }
                    const ncbiTaxon: NCBITaxon = {
                        ref: {
                            namespace: taxonRef.namespace,
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        ncbiID: taxonResult.ncbi_taxon_id!,
                        geneticCode: parseInt(taxonResult.gencode),
                        aliases: taxonResult.aliases.map(({ name, category }) => {
                            return {
                                name,
                                category
                            };
                        }),
                        isBiological
                    };
                    return ncbiTaxon;
                })();
            case 'gtdb':
                return ((): GTDBTaxon => {
                    return {
                        ref: {
                            namespace: 'gtdb',
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological: true
                    };
                })();
            case 'rdp_taxonomy':
                return ((): RDPTaxon => {
                    return {
                        ref: {
                            namespace: 'rdp_taxonomy',
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological: true,
                        incertae_sedis: taxonResult.incertae_sedis!,
                        molecule: taxonResult.molecule! || null,
                        unclassified: taxonResult.unclassified!
                    };
                })();
            case 'silva_taxonomy':
                return ((): SILVATaxon => {
                    return {
                        ref: {
                            namespace: 'silva_taxonomy',
                            id: taxonResult.id,
                            timestamp: result.ts
                        },
                        name: taxonResult.scientific_name,
                        rank: taxonResult.rank,
                        isBiological: true,
                        datasets: taxonResult.datasets!,
                        sequence: taxonResult.sequence!
                    };
                })();
            default:
                throw new Error('Unsupported taxonomy data source');
        }

    }

    async getLinkedObjects(taxonRef: TaxonomyReference, options: GetLinkedObjectsOptions): Promise<GetLinkedObjectsResult> {
        const params = {
            ns: taxonRef.namespace,
            id: taxonRef.id,
            ts: taxonRef.timestamp,
            offset: options.offset,
            limit: options.limit
        };
        const result = await this.taxonomyClient.get_associated_ws_objects(params);
        const linkedObjects = result.results.map((result) => {
            let workspaceType: WorkspaceType;
            let title: string;
            if (result.ws_obj.workspace.narr_name) {
                workspaceType = WorkspaceType.NARRATIVE;
                title = result.ws_obj.workspace.narr_name;
            } else if (result.ws_obj.workspace.refdata_source) {
                workspaceType = WorkspaceType.REFDATA;
                title = result.ws_obj.workspace.refdata_source + ' Reference Data';
            } else {
                workspaceType = WorkspaceType.UNKNOWN;
                title = 'Unknown Workspace Type';
            }
            return {
                linkedAt: result.edge.updated_at,
                objectID: result.ws_obj.object_id,
                workspaceID: result.ws_obj.workspace_id,
                version: result.ws_obj.version,
                objectName: result.ws_obj.name,
                createdAt: result.ws_obj.epoch,
                workspaceUpdatedAt: result.ws_obj.updated_at,
                type: {
                    module: result.ws_obj.type.module_name,
                    name: result.ws_obj.type.type_name,
                    majorVersion: result.ws_obj.type.maj_ver,
                    minorVersion: result.ws_obj.type.min_ver
                },
                workspaceType,
                title
            };
        });
        return {
            linkedObjects,
            totalCount: result.total_count
        };
    }

    async getDataSourceInfo(namespace: Namespace): Promise<DataSourceInfo> {
        const dataSourceId = namespaceToDataSourceId(namespace);

        const {
            data_source
        } = await this.relationEngineClient.data_source(dataSourceId);

        // return {
        //     source: namespaceToRelationEngineDataSource(dataSource.name),
        //     data_url: dataSource.data_url,
        //     home_url: dataSource.home_url,
        //     logo_url: dataSource.logo_url,
        //     title: dataSource.title
        // };
        return data_source;

    }
}
