import { RelationEngineDataSource, RelationEngineCategory, RelationEngineReferenceG } from "./core";

export type TaxonomyNamespace = string;

export type TaxonomyId = string;

export type TaxonomyReference = {
    namespace: string;
    id: TaxonomyId;
    timestamp?: number;
};

export interface TaxonAlias {
    category: string;
    name: string;
}

export interface TaxonMetadataBase {
    id: string;
    label: string;
    tooltip: string;
    type: string;
}

export interface TaxonMetadataString extends TaxonMetadataBase {
    type: 'string',
    value: string | null;
}

export interface TaxonMetadataSequence extends TaxonMetadataBase {
    type: 'sequence',
    value: string | null;
}

export interface TaxonMetadataBoolean extends TaxonMetadataBase {
    type: 'boolean',
    value: boolean | null;
}

export interface TaxonMetadataNumber extends TaxonMetadataBase {
    type: 'number',
    value: number | null;
}

export interface TaxonMetadataArrayOfString extends TaxonMetadataBase {
    type: 'array<string>',
    value: Array<string> | null;
}

export interface TaxonMetadataArrayOfAlias extends TaxonMetadataBase {
    type: 'array<alias>',
    value: Array<TaxonAlias> | null;
}

export type TaxonMetadata =
    TaxonMetadataString |
    TaxonMetadataBoolean |
    TaxonMetadataNumber |
    TaxonMetadataArrayOfString |
    TaxonMetadataArrayOfAlias |
    TaxonMetadataSequence;

export interface Taxon {
    ref: TaxonomyReference,
    name: string;
    rank: string;
    // isBiological: boolean;
    metadata: Array<TaxonMetadata>;
}

