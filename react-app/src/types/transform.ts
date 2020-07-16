
import * as core from './core';

export function relationEngineNamespaceToDataSource(s: core.RelationEngineNamespace): core.RelationEngineDataSource {
    switch (s) {
        case 'go_ontology':
            return core.RelationEngineDataSource.GO;
        case 'envo_ontology':
            return core.RelationEngineDataSource.ENVO;
        case 'ncbi_taxonomy':
            return core.RelationEngineDataSource.NCBI;
        case 'gtdb':
            // gtdb supplies just a taxonomy, so the name is not qualified.
            return core.RelationEngineDataSource.GTDB;
        case 'rdp_taxonomy':
            return core.RelationEngineDataSource.RDP;
        // default:
        //     throw new Error('Unrecognized data source: ' + s);
    }
}

// export function dataSourceToNamespace(dataSource: core.RelationEngineDataSource): core.RelationEngineNamespace {
//     switch (dataSource) {
//         case core.RelationEngineDataSource.GO:
//             return 'go_ontology';
//         case core.RelationEngineDataSource.ENVO:
//             return 'envo_ontology';
//         case core.RelationEngineDataSource.NCBI:
//                 return 'go_ontology';
//                 case core.RelationEngineDataSource.GO:
//                         return 'go_ontology';
//                         case core.RelationEngineDataSource.GO:
//                                 return 'go_ontology';
//     }
// }

export function relationEngineCategoryToString(category: core.RelationEngineCategory): string {
    switch (category) {
        case core.RelationEngineCategory.TAXONOMY:
            return 'taxonomy';
        case core.RelationEngineCategory.ONTOLOGY:
            return 'ontology';
    }
}

export function stringToRelationEngineCategory(categoryString: string) {
    switch (categoryString) {
        case 'taxonomy':
            return core.RelationEngineCategory.TAXONOMY;
        case 'ontology':
            return core.RelationEngineCategory.ONTOLOGY;
        default:
            throw new Error('Unrecognized relation engine category name "' + categoryString + '"');
    }
}

export function stringToNamespace(s: string): core.RelationEngineNamespace {
    const namespaces = [
        'go_ontology',
        'envo_ontology',
        'gtdb',
        'ncbi_taxonomy',
        'rdp_taxonomy'
    ];
    // TODO: i don't like the _as_ :(
    // A verbose alternative is a switch
    if (namespaces.includes(s)) {
        return s as core.RelationEngineNamespace;
    }
    throw new Error('Not a valid namespace: ' + s);
}

// export function stringToRelationEngineRef(relationEngineID: core.RelationEngineID, category: core.RelationEngineCategory): core.RelationEngineReference {
//     const [namespaceString, id, timestampString] = relationEngineID.split('/');
//     const dataSource = relationEngineNamespaceToDataSource(stringToNamespace(namespaceString));
//     // const category = stringToRelationEngineCategory(categoryString);

//     let timestamp: number;
//     if (typeof timestampString === 'undefined') {
//         timestamp = Date.now();
//     } else {
//         timestamp = parseInt(timestampString, 10);
//     }

//     switch (category) {
//         case core.RelationEngineCategory.ONTOLOGY:
//             switch (dataSource) {
//                 case core.RelationEngineDataSource.GO:
//                     return { category, dataSource, id, timestamp };
//                 case core.RelationEngineDataSource.ENVO:
//                     return { category, dataSource, id, timestamp };
//                 default:
//                     throw new Error('Invalid data source for ontology');
//             }
//         case core.RelationEngineCategory.TAXONOMY:
//             switch (dataSource) {
//                 case core.RelationEngineDataSource.NCBI:
//                     return { category, dataSource, id, timestamp };
//                 case core.RelationEngineDataSource.GTDB:
//                     return { category, dataSource, id, timestamp };
//                 case core.RelationEngineDataSource.RDP:
//                     return { category, dataSource, id, timestamp };
//                 default:
//                     throw new Error('Invalid data source for taxonomy');
//             }
//     }
// }

// export function relationEngineReferenceToNamespace(ref: core.RelationEngineReference): core.RelationEngineNamespace {
//     switch (ref.category) {
//         case core.RelationEngineCategory.ONTOLOGY:
//             switch (ref.dataSource) {
//                 case core.RelationEngineDataSource.GO:
//                     return 'go_ontology';
//                 case core.RelationEngineDataSource.ENVO:
//                     return 'envo_ontology';
//             }
//             break;
//         case core.RelationEngineCategory.TAXONOMY:
//             switch (ref.dataSource) {
//                 case core.RelationEngineDataSource.NCBI:
//                     return 'ncbi_taxonomy';
//                 case core.RelationEngineDataSource.GTDB:
//                     return 'gtdb';
//                 case core.RelationEngineDataSource.RDP:
//                     return 'rdp_taxonomy';
//             }
//     }
// }



export function namespaceToDataSourceId(dataSource: core.RelationEngineNamespace): core.RelationEngineDataSourceId {
    switch (dataSource) {
        case 'ncbi_taxonomy':
            return 'ncbi_taxonomy';
        case 'gtdb':
            return 'gtdb';
        case 'rdp_taxonomy':
            return 'rdp_taxonomy';
        case 'go_ontology':
            return 'go_ontology';
        case 'envo_ontology':
            return 'envo_ontology';
    }
}