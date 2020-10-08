import { DynamicServiceClient, DynamicServiceClientParams } from '@kbase/ui-lib';
import sourcesData from './sources.json';

export type Sources = Array<Source>;

const SOURCES: Array<Source> = sourcesData as Array<Source>;

export interface SourceMap {
    [id: string]: Source;
}

// const SOURCES_MAP = SOURCES.reduce<SourceMap>((map, source) => {
//     map[source.id] = source;
//     return map;
// }, {});

const SOURCES_NAMESPACE_MAP = SOURCES.reduce<SourceMap>((map, source) => {
    map[source.namespace] = source;
    return map;
}, {});

interface TaxonomyAPIParams extends DynamicServiceClientParams { }

type TaxonID = string;

interface GetAncestorsParams {
    id: TaxonID;
}

interface GetDescendentsParams {
    id: TaxonID;
}

export type Namespace = string;

interface TaxonAlias {
    canonical: Array<string>;
    category: string;
    name: string;
}

type TaxonResult = any;

export interface GetTaxonParams {
    ns: string;
    id: TaxonID;
    ts?: number;
}

interface GetTaxonResult {
    count: number;
    cursor_id: number | null;
    has_more: false;
    stats: {
        executionTime: number;
        filtered: number;
        httpRequests: number;
        scannedFull: number;
        scannedIndex: number;
        writesExecuted: number;
        writesIgnored: number;
    };
    results: Array<TaxonResult>;
    ts: number;
}

interface GetLineageResult {
    stats: {
        executionTime: number;
        filtered: number;
        httpRequests: number;
        scannedFull: number;
        scannedIndex: number;
        writesExecuted: number;
        writesIgnored: number;
    };
    results: Array<TaxonResult>;
    ts: number;
}

interface GetChildrenResult {
    stats: {
        executionTime: number;
        filtered: number;
        httpRequests: number;
        scannedFull: number;
        scannedIndex: number;
        writesExecuted: number;
        writesIgnored: number;
    };
    results: Array<TaxonResult>;
    total_count: number;
    ts: number;
}
export interface Stats {
    executionTime: number;
    filtered: number;
    httpRequests: number;
    scannedFull: number;
    scannedIndex: number;
    writesExecuted: number;
    writesIgnored: number;
}
export interface GetAssociatedWorkspaceObjectsResultResult {
    edge: {
        _id: string;
        assigned_by: string;
        updated_at: number;
    };
    ws_obj: {
        _id: string;
        deleted: boolean;
        epoch: number;
        hash: string;
        is_public: boolean;
        name: string;
        object_id: number;
        size: number;
        updated_at: number;
        version: number;
        workspace_id: number;
        type: {
            module_name: string;
            type_name: string;
            maj_ver: number;
            min_ver: number;
        },
        workspace: {
            narr_name: string | null;
            refdata_source: string | null;
        };
    };
}

export interface GetAssociatedWorkspaceObjectsResult {
    results: Array<GetAssociatedWorkspaceObjectsResultResult>;
    total_count: number;
    stats: Stats;
    ts: number;
}

export interface GetLineageParams {
    ns: string;
    id: TaxonID;
    ts?: number;
}

export interface GetChildrenParams {
    ns: string;
    id: TaxonID;
    ts?: number;
    offset: number;
    limit: number;
    search_text: string;
}

export interface GetAssociatedWorkspaceObjectsParams {
    ns: string;
    id: TaxonID;
    ts?: number;
    limit: number;
    offset: number;
}

export type SourceFieldDataType = 'string' | 'number' | 'boolean' | 'array<string>' | 'array<alias>' | 'sequence';

export interface SourceFieldDefinition {
    id: string;
    type: SourceFieldDataType;
    label: string;
    tooltip: string;
    description: string;
}

export interface Source {
    id: string;
    namespace: string;
    data_url: string;
    home_url: string;
    logo_url: string;
    license: {
        url: string;
        label: string;
    } | null;
    item_link: {
        template: string;
        label: string;
    } | null;
    citation: string;
    title: string;
    short_title: string;
    fields: Array<SourceFieldDefinition>;
}

export default class TaxonomyAPIClient extends DynamicServiceClient {
    static module: string = 'taxonomy_re_api';

    async get_lineage({ ns, id, ts }: { ns: string, id: TaxonID, ts?: number; }): Promise<GetLineageResult> {
        const params: GetLineageParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetLineageParams], [any]>('get_lineage', [
            params
        ]);
        return result as GetLineageResult;
    }

    async get_children({
        ns,
        id,
        ts,
        offset,
        limit,
        searchTerm
    }: {
        ns: string,
        id: TaxonID,
        ts?: number,
        offset: number,
        limit: number,
        searchTerm: string;
    }): Promise<GetChildrenResult> {
        const [result] = await this.callFunc<[GetChildrenParams], [any]>('get_children', [
            {
                ns, id, ts,
                offset,
                limit,
                search_text: searchTerm
            }
        ]);
        return result as GetChildrenResult;
    }

    async get_taxon({ ns, id, ts }: { ns: string, id: TaxonID, ts?: number; }): Promise<GetTaxonResult> {
        const params: GetTaxonParams = {
            ns, id, ts
        };
        const [result] = await this.callFunc<[GetTaxonParams], [any]>('get_taxon', [
            params
        ]);

        return result as GetTaxonResult;
    }

    async get_associated_ws_objects({
        ns,
        id,
        ts,
        offset,
        limit
    }: {
        ns: string,
        id: TaxonID,
        ts?: number,
        offset: number,
        limit: number;
    }): Promise<GetAssociatedWorkspaceObjectsResult> {
        const params: GetAssociatedWorkspaceObjectsParams = {
            ns, id, ts, limit, offset
        };
        const [result] = await this.callFunc<[GetAssociatedWorkspaceObjectsParams], [GetAssociatedWorkspaceObjectsResult]>('get_associated_ws_objects', [
            params
        ]);
        return result;
    }

    async get_sources(): Promise<Array<Source>> {
        return Promise.resolve(SOURCES);
    }

    async get_source({ ns }: { ns: string; }): Promise<Source> {
        const source = SOURCES_NAMESPACE_MAP[ns];
        return Promise.resolve(source);
    }
}
