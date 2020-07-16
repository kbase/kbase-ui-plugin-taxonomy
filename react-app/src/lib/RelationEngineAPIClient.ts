import axios from 'axios';

export type DataSource =
    'ncbi_taxonomy' |
    'gtdb' |
    'go_ontology' |
    'envo_ontology' |
    'rdp_taxonomy';


export type DataSourceCategory = 'taxonomy' | 'ontology';

// A collection is a top level division of the re data model
// export type Collection = 'taxonomy' | 'ontology';

export interface GetNodeInfoResultBase {
    collection: DataSourceCategory;
    // source: string;
    created: number;
    expired: number;
    timestamp: number;
}

export interface GetNodeInfoResultTaxon extends GetNodeInfoResultBase {
    collection: 'taxonomy';
    // source: TaxonSource;
    namespace: string;
    id: string;
}

export interface GetNodeInfoResultOntology extends GetNodeInfoResultBase {
    collection: 'ontology';
    // source: OntologySource;
    namespace: string;
    id: string;
}

export type GetNodeInfoResult = GetNodeInfoResultTaxon | GetNodeInfoResultOntology;

// export interface GetNodeInfoResult<T, S> {
//     type: NodeType;
//     created: number;
//     source: TaxonSource | OntologySource;
//     version: string;
// }


export interface DataSourcesResult {
    data_sources: Array<DataSource>;
}

export interface DataSourceInfo {
    category: DataSourceCategory;
    name: DataSource;
    data_url: string;
    home_url: string;
    logo_url: string;
    title: string;
}

export interface DataSourceInfoResult {
    data_source: DataSourceInfo;
}

export interface RestClientParams {
    url: string;
    timeout: number;
    token: string;
}

export class RestClient {
    params: RestClientParams;
    constructor(params: RestClientParams) {
        this.params = params;
    }

    async get<ResultType>(path: Array<string>): Promise<ResultType> {
        const url = this.params.url + '/' + path.join('/');
        const result = await axios.get(url, {
            headers: {
                Accept: 'application/json'
            }
        });
        // TODO: handle errors!


        return (result.data as unknown) as ResultType;
    }
}

// function idToRef(relationEngineID: RelationEngineID): RelationEngineReference {

// }

export default class RelationEngineAPIClient extends RestClient {
    async data_sources(): Promise<DataSourcesResult> {
        const path = [
            'api',
            'v1',
            'data_sources'
        ];
        return this.get<DataSourcesResult>(path);
    }

    async data_source(dataSource: DataSource): Promise<DataSourceInfoResult> {
        const path = [
            'api',
            'v1',
            'data_sources',
            dataSource
        ];
        return this.get<DataSourceInfoResult>(path);
    }

    // async getNodeInfo(relationEngineID: RelationEngineID): Promise<[GetNodeInfoResult]> {
    //     const classRe = /^(.*?)\/(.*)$/;
    //     const taxonomyRe = /^([^/]+)\/([^/]+)(?:\/([^/]+))?$/;
    //     const ontologyRe = /^([^/]+)\/([^/]+)(?:\/([^/]+))?$/;
    //     return new Promise<[GetNodeInfoResult]>((resolve, reject) => {
    //         let m = classRe.exec(relationEngineID);
    //         if (!m) {
    //             reject(new Error('Invalid relation engine ID ' + relationEngineID));
    //             return;
    //         }
    //         const [, collection, rest] = m;
    //         // const [collection] = relationEngineID.split('/');
    //         switch (collection) {
    //             case 'taxonomy': (() => {
    //                 m = taxonomyRe.exec(rest);
    //                 if (!m) {
    //                     reject(new Error('Taxonomy ref is '));
    //                     return;
    //                 }
    //                 if (m.length !== 4) {
    //                     reject(new Error('Invalid relation engine id "' + relationEngineID + '"'));
    //                 }
    //                 const [, namespace, id, timestampString] = m;
    //                 let timestamp: number;
    //                 if (!timestampString) {
    //                     timestamp = Date.now();
    //                 } else {
    //                     timestamp = parseInt(timestampString, 10);
    //                 }

    //                 switch (namespace) {
    //                     case 'ncbi_taxonomy':
    //                         resolve([
    //                             {
    //                                 collection: 'taxonomy',
    //                                 namespace: namespace,
    //                                 id: id,
    //                                 timestamp,
    //                                 created: Date.now(),
    //                                 expired: new Date(2055, 5, 5).getTime()
    //                             }
    //                         ]);
    //                         return;
    //                     default:
    //                         reject(new Error('Unrecognized taxonomy namespace "' + namespace + '"'));
    //                         return;
    //                 }
    //             })();
    //                 break;
    //             case 'ontology':
    //                 m = ontologyRe.exec(rest);
    //                 if (!m) {
    //                     reject(new Error('Taxonomy ref is '));
    //                     return;
    //                 }
    //                 const [, namespace, id, timestampString] = m;
    //                 let timestamp: number;
    //                 if (timestampString) {
    //                     timestamp = parseInt(timestampString);
    //                 } else {
    //                     timestamp = Date.now();
    //                 }
    //                 switch (namespace) {
    //                     case 'go':
    //                         resolve([
    //                             {
    //                                 collection: 'ontology',
    //                                 namespace,
    //                                 id,
    //                                 timestamp,
    //                                 created: Date.now(),
    //                                 expired: new Date(2055, 5, 5).getTime()
    //                             }
    //                         ]);
    //                         return;
    //                     default:
    //                         reject(new Error('Ontology namespace not found "' + namespace + '"'));
    //                         return;
    //                 }
    //             default:
    //                 reject(new Error(`Collection ${collection} does not resolve to a type`));
    //         }
    //     });
    // }
}
