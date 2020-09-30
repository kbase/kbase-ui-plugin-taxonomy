import { DynamicServiceClient, DynamicServiceClientParams } from '@kbase/ui-lib';

const SOURCES: Array<Source> = [
    {
        id: 'ncbi',
        namespace: 'ncbi_taxonomy',
        data_url: 'ftp://ftp.ncbi.nlm.nih.gov/pub/taxonomy/',
        home_url: 'https://www.ncbi.nlm.nih.gov/taxonomy',
        logo_url: 'https://ci.kbase.us/ui-assets/images/third-party-data-sources/ncbi/logo-51-64.png',
        title: 'NCBI',
        fields: [{
            id: 'ncbi_taxon_id',
            type: 'number',
            label: 'NCBI ID',
            tooltip: 'ID for this taxon at NCBI',
            description: ''
        }, {
            id: 'gencode',
            type: 'number',
            label: 'Genetic Code',
            tooltip: 'NCBI Genetic code',
            description: ''
        }, {
            id: 'aliases',
            type: 'array<alias>',
            label: 'Aliases',
            tooltip: 'Aliases for this taxon',
            description: ''
        }]
    }, {
        id: 'gtdb',
        namespace: 'gtdb',
        data_url: 'https://data.ace.uq.edu.au/public/gtdb/data/releases/',
        home_url: 'https://gtdb.ecogenomic.org',
        logo_url: 'https://ci.kbase.us/ui-assets/images/third-party-data-sources/gtdb/logo-128-64.png',
        title: 'GTDB Taxonomy',
        fields: []
    }, {
        id: 'rdp',
        namespace: 'rdp_taxonomy',
        data_url: 'http://rdp.cme.msu.edu/misc/resources.jsp',
        home_url: 'http://rdp.cme.msu.edu/taxomatic/main.spr',
        logo_url: 'http://rdp.cme.msu.edu/images/rdpinsider108x81.png',
        title: 'Ribosomal Database Project',
        fields: [{
            id: 'incertae_sedis',
            type: 'boolean',
            label: 'Incertae Sedis?',
            tooltip: 'ID for this taxon at NCBI',
            description: 'Indicates a taxonomic group where its broader relationships are unknown or undefined'
        }, {
            id: 'molecule',
            type: 'string',
            label: 'Molecule',
            tooltip: '',
            description: ''
        }, {
            id: 'unclassified',
            type: 'boolean',
            label: 'Unclassified?',
            tooltip: '',
            description: ''
        }]
    }, {
        id: 'silva',
        namespace: 'silva_taxonomy',
        data_url: 'https://arb-silva.de/no_cache/download/archive/',
        home_url: 'https://arb-silva.de',
        logo_url: 'https://www.arb-silva.de/fileadmin/graphics_general/main/logos/silva-subtitle.svg',
        title: 'SILVA Taxonomy',
        fields: [{
            id: 'datasets',
            type: 'array<string>',
            label: 'Data Sets',
            tooltip: '',
            description: ''
        }, {
            id: 'sequence',
            type: 'sequence',
            label: 'Sequence',
            tooltip: '',
            description: ''
        }]
    }
];

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

// interface TaxonResult {
//     _id: string;
//     _key: string;
//     _rev: string;
//     id: string;
//     ns: string;
//     ts: number;
//     aliases: Array<TaxonAlias>;
//     canonical_scientific_name: Array<string>;
//     gencode: string;
//     rank: string;
//     scientific_name: string;
//     ncbi_taxon_id?: number;
//     incertae_sedis?: boolean;
//     molecule?: string | null;
//     unclassified?: boolean;
//     datasets?: Array<string>;
//     sequence?: string;
// }

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
    title: string;
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
