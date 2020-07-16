import { Path, Request } from "./Request";
import { RouteSpec } from "./RouteSpec";

export interface NavLocation {
    path: Path;
    external?: boolean;
    replace?: boolean;
    params?: Params;
}

export interface Params {
    // rest: Array<string>;
    [key: string]: string;
}

export interface NotFoundExceptionParams {
    hash: string;
    path: string;
    params: Params;
    request: Request;
    message: string;
}

export class NotFoundException extends Error {
    hash: string;
    path: string;
    params: Params;
    request: Request;
    constructor({ hash, path, params, request, message }: NotFoundExceptionParams) {
        super(message);
        this.hash = hash;
        this.path = path;
        this.params = params;
        this.request = request;
    }
}
// function NotFoundException(request) {
//     this.name = 'NotFoundException';
//     this.original = request.original;
//     this.path = request.path;
//     this.params = request.params;
//     this.request = request.request;
// }
// NotFoundException.prototype = Object.create(Error.prototype);
// NotFoundException.prototype.constructor = NotFoundException;

export interface Query {
    [key: string]: string;
}

function paramsToQueryString(params: Params): string {
    return Object.keys(params)
        .map((key) => {
            return key + '=' + encodeURIComponent(params[key]);
        })
        .join('&');
}

export interface RouterConfig {
    defaultRoute?: RouteSpec;
}


export class Router {
    routes: Array<RouteSpec>;
    defaultRoute?: RouteSpec;
    constructor(config?: RouterConfig) {
        // Routing
        this.routes = [];
        if (config) {
            this.defaultRoute = config.defaultRoute;
        }

    }

    addRoute(routeSpec: RouteSpec) {
        this.routes.push(routeSpec);
    }

    matchPath(path: Array<string>, route: RouteSpec) {
        // Match the path.
        // Walk through the path, for each path element:
        // - if no more route path elements, and "captureExtraPath" is set,
        //   and the last path element is of type "rest", put the rest of
        //   the request path into the special "rest" parameter.
        // - process parameter based on the type.
        const params: Params = {};
        matchloop: for (let j = 0; j < path.length; j += 1) {
            const routePathElement = route.path[j];
            const requestPathElement = path[j];
            if (!routePathElement) {
                // end of the route path.
                if (route.captureExtraPath) {
                    // TODO: had to convert this back to string for now -- nicer typing
                    params.rest = path.slice(j - 1).join('/');
                    break;
                }
            }

            switch (routePathElement.type) {
                case 'literal':
                    // current path element must match current route element
                    if (routePathElement.value !== requestPathElement) {
                        return;
                    }
                    break;
                // TODO: removed for now -- restore?
                // case 'options':
                //     // current path element must match at least one of the
                //     // route elements in the "value" property (array).
                //     if (
                //         !routePathElement.value.some((option) => {
                //             if (requestPathElement === option) {
                //                 return true;
                //             }
                //         })
                //     ) {
                //         return;
                //     }
                //     break;
                case 'param':
                    // current path element is not compared, it is considered
                    // a positive match, and is stored in the params  map
                    // under the name of the route elements 'name' property.
                    params[routePathElement.name] = requestPathElement;
                    break;
                // TODO: disable regexp - restore later ??
                // case 'regexp':
                //     // current path element is matched against a regular expression
                //     // defined by the current route element.
                //     try {
                //         const regexp = new RegExp(routePathElement.regexp);
                //         if (!regexp.test(requestPathElement)) {
                //             return;
                //         }
                //     } catch (ex) {
                //         console.warn('invalid route with regexp element', ex);
                //         return;
                //     }
                //     break;
                case 'rest':
                    // unconditionally matches the rest of the request path, storing it
                    // as an array in a parameter named  by the 'name' property, or
                    // if this is missing or falsy, 'rest'.
                    var name = routePathElement.name || 'rest';
                    if (j < route.path.length - 1) {
                        console.warn('rest parameter used before final route element');
                        console.warn('  being treated as regular param');
                        params[name] = requestPathElement;
                        continue;
                    }

                    // if (routePathElement.joinWith) {
                    //     params[name] = path.slice(j).join(routePathElement.joinWith);
                    // } else {
                    //     params[name] = path.slice(j);
                    // }

                    // TODO: should we join this, or leave as array? Easier to join for now
                    // to make typing easier...
                    params[name] = path.slice(j).join('/');

                    break matchloop;
                default:
                    // If the path element is not well formed (not a recognized type)
                    // just skip it with a warning.
                    console.warn('invalid route: type not recognized', routePathElement);
                    return;
            }
        }
        return params;
    }

    processPath(path: Path) {
        let route: RouteSpec;
        for (let i = 0; i < this.routes.length; i += 1) {
            route = this.routes[i];

            const isRest = route.path[route.path.length - 1].type === 'rest';
            if (route.path.length > path.length) {
                // We can only match on a path shorter than the route path if:
                // - all params after the route path after the end of the current path are optional
                // - the route has the flag "captureExtraPath"
                // - the route has a final path element defined as type "rest"
                // - the route path elements beyond the end of the path are optional
                const isTailOptional = route.path.slice(path.length)
                    .every((routePathElement) => {
                        return routePathElement.optional;
                    });
                if (!(isTailOptional || route.captureExtraPath || isRest)) {
                    continue;
                }
            } else if (route.path.length < path.length) {
                // A longer path may match if either the route can automatically
                // capture the rest of the path or the last component is of type 'rest'
                // TODO: use one or the other, not both!
                if (!(route.captureExtraPath || isRest)) {
                    continue;
                }
            }

            const params = this.matchPath(path, route);

            if (params) {
                return { route, params };
            }
        }
        console.error('not found?', path);
        throw new Error('Not found');
    }

    processQuery(route: RouteSpec, query: Query) {
        // Now process any query parameters.
        // Query params are not used for route selection, but are used
        // to populate the params object.
        // Only query params provided in the route will be extracted and
        // placed into the params.

        const params: Params = {};

        // The total params is the path params and query params
        const searchParamKeys = Object.keys(query);
        const queryParamsSpec = route.queryParams || {};

        // Use the query params spec in the route first. This picks up
        // literals, and also enables the strict query param protocol in
        // which only defined query params are recognized.
        // The captureExtraSearch route flag disables the latter behavior.
        // All undefined query params are simply copied to the req.query.
        Object.keys(queryParamsSpec).forEach((key) => {
            const paramSpec = queryParamsSpec[key];
            // This allows for supplying a param
            // from the config.
            // TODO: improve this, and add support for query param specs
            //       e.g. type coercion.
            if (paramSpec.type === 'literal') {
                // A query param can also be specified as a
                // literal value, in which case the value from the spec
                // is placed into the params.
                params[key] = paramSpec.value;
            } else if (typeof query[key] !== 'undefined') {
                // Defaults to simply using the query value if it is found.
                params[key] = query[key];
            } else {
                return;
            }
            // delete searchParamKeys[key];
        });
        if (route.captureExtraSearch) {
            searchParamKeys.forEach((key) => {
                params[key] = query[key];
            });
        }
        return params;
    }

    findRoute(request: Request) {
        // No route at all? Return the default route.
        if (request.path.length === 0 && Object.keys(request.query).length === 0) {
            throw new Error('No request to route!');
            // return {
            //     request,
            //     params: {},
            //     route: this.defaultRoute
            // };
        }

        const { route, params } = this.processPath(request.path);

        // if (!route) {
        //     // throw new NotFoundException({
        //     //     request,
        //     //     params: {},
        //     //     hash: request.hash,
        //     //     path: request.path.join('/'),
        //     //     message: 'Not found'
        //     // });
        //     return {};
        // }

        const queryParams = this.processQuery(route, request.query);

        // Now we handle fixed params; this operates a bit like props. They are specified
        // in the route config, and simply amend the props passed to the widget.
        // This provides a mechanism for the plugin to directly pass params to the route's
        // widget.
        Object.assign(params, queryParams);

        return {
            route,
            params
        };
    }

    // findCurrentRoute(request: Request) {
    //     return this.findRoute(request);
    // }

    listRoutes() {
        return this.routes.map((route) => {
            return route.path;
        });
    }

    navigateTo(location: NavLocation) {
        let queryString, finalPath;
        // if (typeof location.path === 'string') {
        //     providedPath = location.path.split('/');
        // } else if (typeof location.path === 'object' && typeof location.path.push === 'function') {
        //     providedPath = location.path;
        // } else {
        //     console.error(
        //         'Invalid path in location',
        //         typeof location.path,
        //         location.path instanceof Array,
        //         JSON.parse(JSON.stringify(location))
        //     );
        //     throw new Error('Invalid path in location');
        // }
        // we eliminate empty path components, like extra slashes, or an initial slash.
        const normalizedPath = location.path
            .filter((element) => {
                if (!element || typeof element !== 'string') {
                    return false;
                }
                return true;
            })
            .join('/');
        if (location.params) {
            queryString = paramsToQueryString(location.params);
        }

        // // Oops, may be provided as "query" property
        // if (location.query) {
        //     queryString = paramsToQueryString(location.query);
        // }
        if (queryString) {
            finalPath = normalizedPath + '?' + queryString;
        } else {
            finalPath = normalizedPath;
        }
        if (location.external) {
            finalPath = '/' + finalPath;
            if (location.replace) {
                this.replacePath(finalPath);
            } else {
                // We need to blow away the whole thing, since there will
                // be a hash there.
                window.location.href = finalPath;
            }
        } else {
            if (location.replace) {
                this.replacePath('#' + finalPath);
            } else {
                // if (location.urlPath) {
                //     const url = new URL(window.location.toString());
                //     url.hash = '#' + finalPath;
                //     url.pathname = location.urlPath;
                //     window.location.assign(url.toString());
                // } else {

                const url = new URL(window.location.toString());
                url.hash = '#' + finalPath;
                url.pathname = '';
                window.location.assign(url.toString());
                // window.location.hash = '#' + finalPath;
                // }
            }
        }
    }

    replacePath(location: string) {
        window.location.replace(location);
    }

    redirectTo(location: string, newWindow: boolean) {
        if (newWindow) {
            window.open(location);
        } else {
            window.location.replace(location);
        }
    }
}

