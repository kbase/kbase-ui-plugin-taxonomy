import { TaxonomyReference, Taxon, TaxonMetadata } from '../types/taxonomy';
import TaxonomyAPIClient, { Namespace, Source, SourceFieldDefinition } from './TaxonomyAPIClient';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';

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

export class TaxonomyModel {
    taxonomyClient: TaxonomyAPIClient;
    constructor({ token, url, taxonomyAPIConfig }: TaxonomyModelParams) {
        this.taxonomyClient = new TaxonomyAPIClient({
            token,
            url,
            timeout: REQUEST_TIMEOUT,
            version: taxonomyAPIConfig.version
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

        const source = await this.taxonomyClient.get_source({
            ns: taxonRef.namespace
        });

        return result.results.map((taxonResult) => {
            const metadata: Array<TaxonMetadata> = source.fields
                .map((field) => {
                    if (field.id in taxonResult) {
                        return this.transformField({
                            id: field.id,
                            type: field.type,
                            value: taxonResult[field.id],
                            def: field
                        });
                    } else {
                        return this.transformField({
                            id: field.id,
                            type: field.type,
                            value: null,
                            def: field
                        });
                    }
                });
            return {
                ref: {
                    namespace: taxonResult.ns,
                    id: taxonResult.id,
                    timestamp: result.ts
                },
                name: taxonResult.name || taxonResult.scientific_name,
                rank: taxonResult.rank,
                metadata
            };
        });
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
            search_text: options.searchTerm
        });

        const source = await this.taxonomyClient.get_source({
            ns: taxonRef.namespace
        });

        // TODO: Ensure that base fields are there.

        // TODO: Based on the source, pluck off the extra fields and place into 
        // the metadata

        return [
            result.results.map((taxonResult) => {
                const metadata: Array<TaxonMetadata> = source.fields
                    .map((field) => {
                        if (field.id in taxonResult) {
                            return this.transformField({
                                id: field.id,
                                type: field.type,
                                value: taxonResult[field.id],
                                def: field
                            });
                        } else {
                            return this.transformField({
                                id: field.id,
                                type: field.type,
                                value: null,
                                def: field
                            });
                        }
                    });
                return {
                    ref: {
                        namespace: taxonResult.ns,
                        id: taxonResult.id,
                        timestamp: result.ts
                    },
                    name: taxonResult.name || taxonResult.scientific_name,
                    rank: taxonResult.rank,
                    metadata
                };
            }), result.total_count
        ];
    }

    transformField({ id, type, value, def }: { id: string, type: string, value: any, def: SourceFieldDefinition; }): TaxonMetadata {
        const { label, tooltip } = def;
        switch (type) {
            case 'string':
                if (value === null) {
                    return {
                        id, type, value, label, tooltip
                    };
                } else if (typeof value === 'string') {
                    return {
                        id, type, value, label, tooltip
                    };
                } else {
                    throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
                }
            case 'boolean':
                if (value === null) {
                    return {
                        id, type, value, label, tooltip
                    };
                } else if (typeof value === 'boolean') {
                    return {
                        id, type, value, label, tooltip
                    };
                } else {
                    throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
                }
            case 'number':
                if (value === null) {
                    return {
                        id, type, value, label, tooltip
                    };
                } else if (typeof value === 'number') {
                    return {
                        id, type, value, label, tooltip
                    };
                } else {
                    throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
                }
            case 'array<string>':
                if (value === null) {
                    return {
                        id, type, value, label, tooltip
                    };
                } else if (Array.isArray(value) && value.every((value) => {
                    return typeof value === 'string';
                })) {
                    return {
                        id, type, value, label, tooltip
                    };
                } else {
                    throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
                }
            case 'array<alias>':
                if (value === null) {
                    return {
                        id, type, value, label, tooltip
                    };
                } else if (Array.isArray(value) && value.every((value) => {
                    return 'category' in value &&
                        typeof value.category === 'string' &&
                        'name' in value &&
                        typeof value.name === 'string';
                })) {
                    return {
                        id, type, value, label, tooltip
                    };
                } else {
                    throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
                }
            case 'sequence':
                if (value === null) {
                    return {
                        id, type, value, label, tooltip
                    };
                } else if (typeof value === 'string') {
                    return {
                        id, type, value, label, tooltip
                    };
                } else {
                    throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
                }
            default:
                throw new Error('Unsupported type: ' + type);
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

        // Get the source
        const source = await this.taxonomyClient.get_source({
            ns: taxonRef.namespace
        });

        // TODO: Ensure that base fields are there.

        // TODO: Based on the source, pluck off the extra fields and place into 
        // the metadata
        const metadata: Array<TaxonMetadata> = source.fields
            .map((field) => {
                if (field.id in taxonResult) {
                    return this.transformField({
                        id: field.id,
                        type: field.type,
                        value: taxonResult[field.id],
                        def: field
                    });
                } else {
                    return this.transformField({
                        id: field.id,
                        type: field.type,
                        value: null,
                        def: field
                    });
                }
            });
        return {
            ref: {
                namespace: taxonResult.ns,
                id: taxonResult.id,
                timestamp: result.ts
            },
            name: taxonResult.name || taxonResult.scientific_name,
            rank: taxonResult.rank,
            metadata
        };
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

    async getDataSourceInfo(namespace: Namespace): Promise<Source> {
        // const dataSourceId = namespaceToDataSourceId(namespace);

        // const {
        //     data_source
        // } = await this.relationEngineClient.data_source(dataSourceId);

        // // return {
        // //     source: namespaceToRelationEngineDataSource(dataSource.name),
        // //     data_url: dataSource.data_url,
        // //     home_url: dataSource.home_url,
        // //     logo_url: dataSource.logo_url,
        // //     title: dataSource.title
        // // };
        // return data_source;

        return await this.taxonomyClient.get_source({
            ns: namespace
        });

    }
}
