export interface Params {
    [key: string]: string;
}

export type PathElement = string;

export type Path = Array<PathElement>;

export interface Request {
    hash: string; // original hash 
    plugin: string;
    view: string;
    path: Path;
    query: Query;
}

export interface Query {
    [key: string]: string;
}

function parseQueryString(queryString: string): Query {
    const fields = queryString.split(/[?&]/);
    const params: Query = {};
    fields.forEach((field) => {
        if (field.length > 0) {
            const [key, value] = field.split('=');
            if (key.length > 0) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        }
    });
    return params;
}

function getQuery(): Query {
    const query = window.location.search;
    if (!query || query.length === 1) {
        return {};
    }
    return parseQueryString(query.substr(1));
}


export default class RequestFetcher {
    getHashRequest(): Request {
        let hashQuery: Query = {};

        // Also get the query the normal way ...
        const query = getQuery();

        // Handle top level window and iframe.
        let global;
        if (window.parent) {
            global = window.parent;
        } else {
            global = window;
        }

        if (!global.location.hash || global.location.hash.length <= 1) {
            // TODO: need to use a default path??
            throw new Error('no request');
        }

        // The path is (for now) from the hash component.
        const hash = window.location.hash.substr(1);
        const pathAndQuery = hash.split('?', 2);

        // Merge the query attached to the hash with the real query.
        // The real query will most likely be empty.
        if (pathAndQuery.length === 2) {
            hashQuery = parseQueryString(pathAndQuery[1]);
            Object.keys(hashQuery).forEach((key) => {
                query[key] = hashQuery[key];
            });
        }

        // Get a normalized path as an array.
        const path = pathAndQuery[0]
            .split('/')
            .filter((pathComponent) => {
                return pathComponent.length > 0;
            })
            .map((pathComponent) => {
                return decodeURIComponent(pathComponent);
            });

        // Extract out the standard bits from the format:
        // plugin/view/rest
        const [plugin, view, ...rest] = path;

        return {
            hash,
            path,
            query,
            plugin,
            view
            // rest
        };
    }
}
