
import * as core from './core';

export function relationEngineNamespaceToDataSource(s: core.RelationEngineNamespace): core.RelationEngineDataSource {
    return s;
}

export function relationEngineCategoryToString(category: core.RelationEngineCategory): string {
    return category;
}

export function stringToRelationEngineCategory(categoryString: string) {
    return categoryString;
    // switch (categoryString) {
    //     case 'taxonomy':
    //         return core.RelationEngineCategory.TAXONOMY;
    //     case 'ontology':
    //         return core.RelationEngineCategory.ONTOLOGY;
    //     default:
    //         throw new Error('Unrecognized relation engine category name "' + categoryString + '"');
    // }
}

export function stringToNamespace(s: string): core.RelationEngineNamespace {
    return s;
}

export function namespaceToDataSourceId(dataSource: core.RelationEngineNamespace): core.RelationEngineDataSourceId {
    return dataSource;
}