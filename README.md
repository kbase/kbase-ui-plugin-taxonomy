# KBase UI Plugin: Taxonomy Support

> View a taxon with a specific taxonomy, and navigation within 
> that taxonomy

This is a plugin for [kbase-ui](https://github.com/kbase/kbase-ui), which allows a KBase user to view individual taxons, and navigate within the taxonomy to which that taxon belongs.

The canonical home for it is https://narrative.kbase.us#taxonomy, but that won't work as-is 

Currently the Taxonomy plugin supports [NCBI](https://www.ncbi.nlm.nih.gov/taxonomy),  [GTDB](https://gtdb.ecogenomic.org), and [RDP](https://rdp.cme.msu.edu/index.jsp), [SILVA](https://www.arb-silva.de) taxonomies.

## Usage

As a kbase-ui plugin, the taxonomy landing page is invoked with a base of `https://ENV.kbase.us`, where `ENV` is the deployment environment such as `narrative` for production, and a path formed by the url fragment, commonly know as the _hash_ due to the usage of the `#` character to prefix it, the base of which is `#taxonomy`

## Install

This plugin is a dependency of [kbase-ui](https://github.com/kbase/kbase-ui).

## Background

This plugin exists to provide an endpoint for inspecting a taxonomic reference.

## API
### General URL

The general form is:

```url
https://ENV.kbase.us#taxonomy/taxon/NAMESPACE/ID[/TIMESTAMP]
```

where:

- `ENV` is the KBase deployment environment, `narrative`, `next`, `ci`, and others.
- - `taxonomy` is the dispatch name for the taxonomy plugin
- `taxon` indicates we want the taxon viewer
- `NAMESPACE` is the Relation Engine (RE) namespace; current namespaces include: `ncbi_taxonomy`, `gtdb`, `rdb_taxonomy`, and `silva_taxonomy`.
- `ID` is the taxonomy id; it should be the same as the native taxonomy id for the given taxonomy.
- `TIMESTAMP` is an optional epoch timestamp in milliseconds; it represents the point in time at which to consider the taxonomy, and defaults to the current time. Taxonomies are updated periodically; in order to manage changes to taxonomies over time, updated, new, or deleted taxons are marked with start and end timestamps, as appropriate, to define when they are to be considered effective.

### URL Examples

The taxonomy landing page is meant to be linked to from other apps which expose a taxonomic assignment.

#### Current E. coli

```url
https://ci.kbase.us#taxonomy/taxon/ncbi_taxonomy/562
```

#### E. coli taxon on 1/1/2021

```url
https://ci.kbase.us#taxonomy/taxon/ncbi_taxonomy/562/1609459200000
```

## License
SEE LICENSE IN LICENSE.md
```