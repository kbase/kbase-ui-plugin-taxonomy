
export enum ObjectClass {
    TAXONOMY,
    ONTOLOGY
}

export enum LoadingStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface NoneState {
    status: LoadingStatus.NONE;
}

export interface LoadingState {
    status: LoadingStatus.LOADING;
}

export interface ErrorState {
    status: LoadingStatus.ERROR;
    message: string;
}

export interface LoadedState {
    status: LoadingStatus.LOADED;
}

// export enum RelationEngineCategory {
//     TAXONOMY,
//     ONTOLOGY
// }



// export function relationEngineReferenceToNamespace(ref: RelationEngineReference): RelationEngineNamespace {
//     switch (ref.category) {
//         case RelationEngineCategory.ONTOLOGY:
//             switch (ref.dataSource) {
//                 case RelationEngineDataSource.GO:
//                     return 'go_ontology';
//                 case RelationEngineDataSource.ENVO:
//                     return 'envo_ontology';
//             }
//         case RelationEngineCategory.TAXONOMY:
//             switch (ref.dataSource) {
//                 case RelationEngineDataSource.NCBI:
//                     return 'ncbi_taxonomy';
//                 case RelationEngineDataSource.GTDB:
//                     return 'gtdb_taxonomy';
//                 case RelationEngineDataSource.RDP:
//                     return 'rdp_taxonomy';
//             }
//     }
// }





// export type RelationEngineCategory = 'ontology' | 'taxonomy';

// export enum RelationEngineDataSource {
//     ENVO,
//     GO,
//     GTDB,
//     NCBI,
//     RDP
// }

// export type RelationEngineNamespace =
//     'envo_ontology' |
//     'go_ontology' |
//     'gtdb_taxonomy' |
//     'ncbi_taxonomy' |
//     'rdp_taxonomy';



// export type RelationEngineDataSource = RelationEngineNamespace;



// export interface RelationEngineReferenceBase {
//     category: core.RelationEngineCategory,
//     dataSource: core.RelationEngineDataSource;
//     // namespace: RelationEngineNamespace,
//     id: RelationEngineID;
//     timestamp: RelationEngineTimestamp;
// }

// export interface RelationEngineReferenceG<CategoryType extends RelationEngineCategory, DataSourceType extends RelationEngineDataSource> {
//     category: CategoryType;
//     dataSource: DataSourceType;
//     id: RelationEngineID;
//     timestamp: RelationEngineTimestamp
// }

// export type RelationEngineReferencex = OntologyReference | TaxonomyReference;

// export type RelationEngineReference =
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.GO> |
//     RelationEngineReferenceG<RelationEngineCategory.ONTOLOGY, RelationEngineDataSource.ENVO> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.NCBI> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.GTDB> |
//     RelationEngineReferenceG<RelationEngineCategory.TAXONOMY, RelationEngineDataSource.RDP>



// WTF

