import { PathSpec, QuerySpec, ParamsSpec, RouteSpec } from "./RouteSpec";

export interface RouteConfig {
    path: PathSpec | string;
    view: string;
    captureExtraPath?: boolean;
    captureExtraSearch?: boolean;
    queryParams?: QuerySpec;
    params?: ParamsSpec;
}

export function transformPathSpec(path: string): [PathSpec, QuerySpec | undefined] {
    // split on query
    const [pathPart, queryPart] = path.split('?');

    // split path
    const pathElements = pathPart.split('/');

    // create path spec
    const pathSpec: PathSpec = pathElements.map((pathElement) => {
        if (pathElement.charAt(0) === ':') {
            if (pathElement.charAt(1) === '-') {
                return {
                    type: 'param',
                    name: pathElement.slice(2),
                    optional: true
                };
            }
            return {
                type: 'param',
                name: pathElement.slice(1),
                optional: false
            };
        }
        return {
            type: 'literal',
            value: pathElement.slice(0)
        };
    });

    if (!queryPart) {
        return [pathSpec, {}];
    }

    // create query spec
    const querySpec: QuerySpec = queryPart.split('&').reduce<QuerySpec>((querySpec, queryField) => {
        const [queryName, paramName] = queryField.split('=');
        if (!queryName) {
            throw new Error('Query name not provided in path spec');
        }
        // destructuring arrays from Array<string> may result in 
        // undefined variables; split will always produce a string element for the 
        // first position, even if the string being split is empty.
        if (typeof paramName === 'undefined') {
            throw new Error('Param name not provided in path spec');
        }
        if (paramName.charAt(0) === ':') {
            if (paramName.charAt(1) === '-') {
                querySpec[queryName] = {
                    type: 'param',
                    name: paramName.slice(2),
                    optional: true
                };
            } else {
                querySpec[queryName] = {
                    type: 'param',
                    name: paramName.slice(1),
                    optional: false
                };
            }
        } else {
            querySpec[queryName] = {
                type: 'literal',
                name: paramName.slice(0),
                value: paramName
            };
        }
        return querySpec;
    }, {});

    return [pathSpec, querySpec];
}

export function routeConfigToSpec(config: RouteConfig): RouteSpec {
    if (typeof config.path === 'string') {
        const [path, queryParams] = transformPathSpec(config.path);
        return {
            path, queryParams,
            view: config.view,
            captureExtraPath: config.captureExtraPath,
            captureExtraSearch: config.captureExtraSearch
        };
    }
    // const x = config.path;
    // return config;
    return {
        path: config.path,
        view: config.view,
        captureExtraPath: config.captureExtraPath,
        captureExtraSearch: config.captureExtraSearch,
        queryParams: config.queryParams
    };
}   