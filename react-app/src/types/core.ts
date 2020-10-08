
export type RelationEngineID = string;

export type RelationEngineTimestamp = number;


export type RelationEngineCategory = string;

export type RelationEngineDataSource = string;


export function namespaceToRelationEngineDataSource(namespace: RelationEngineNamespace): RelationEngineDataSource {
    return namespace;

}

export interface RelationEngineReferenceG<CategoryType extends RelationEngineCategory, DataSourceType extends RelationEngineDataSource> {
    category: CategoryType;
    dataSource: DataSourceType;
    id: string;
    timestamp: number;
}


export type RelationEngineNamespace = string;


export type RelationEngineDataSourceId = string;