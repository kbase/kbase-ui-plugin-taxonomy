

// import { OntologyReference, OntologyNamespace } from './ontology';
// import { TaxonomyReference, TaxonomyNamespace } from './taxonomy';

export type RelationEngineID = string;

export type RelationEngineTimestamp = number;

export enum RelationEngineCategory {
    TAXONOMY,
    ONTOLOGY
}

export enum RelationEngineDataSource {
    ENVO = 'ENVO',
    GO = 'GO',
    GTDB = 'GTDB',
    NCBI = 'NCBI',
    RDP = 'RDP',
    SILVA = 'SILVA'
}

// export type RelationEngineDataSource = 'ncbi_taxonomy' | 'gtdb' | 'rdp_taxonomy';

export function namespaceToRelationEngineDataSource(namespace: RelationEngineNamespace): RelationEngineDataSource {
    switch (namespace) {
        case 'go_ontology':
            return RelationEngineDataSource.GO;
        case 'envo_ontology':
            return RelationEngineDataSource.ENVO;
        case 'gtdb':
            return RelationEngineDataSource.GTDB;
        case 'ncbi_taxonomy':
            return RelationEngineDataSource.NCBI;
        case 'rdp_taxonomy':
            return RelationEngineDataSource.RDP;
        default:
            throw new Error(`String cannot map to relation engine data source: ${namespace}`);
    }
}

export interface RelationEngineReferenceG<CategoryType extends RelationEngineCategory, DataSourceType extends RelationEngineDataSource> {
    category: CategoryType;
    dataSource: DataSourceType;
    id: string;
    timestamp: number;
}

// export type OntologyReference =
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.GO> |
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.ENVO>;

// export type TaxonomyReference =
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.NCBI> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.GTDB> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.RDP>;

// export type RelationEngineReference = OntologyReference | TaxonomyReference;

// export type RelationEngineNamespace = OntologyNamespace | TaxonomyNamespace;
export type RelationEngineNamespace =
    'go_ontology' |
    'envo_ontology' |
    'ncbi_taxonomy' |
    'gtdb' |
    'rdp_taxonomy' |
    'silva_taxonomy';



// export type RelationEngineReference =
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.GO> |
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.ENVO> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.NCBI> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.GTDB> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.RDP>

export type RelationEngineDataSourceId =
    'ncbi_taxonomy' |
    'gtdb' |
    'rdp_taxonomy' |
    'go_ontology' |
    'envo_ontology' |
    'silva_taxonomy';