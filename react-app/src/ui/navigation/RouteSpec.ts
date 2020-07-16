
export interface PathElementSpecBase {
    type: 'literal' | 'param' | 'rest';
    optional?: boolean;
}

export interface PathElementLiteralSpec extends PathElementSpecBase {
    type: 'literal';
    value: string;
}

export interface PathElementParamSpec extends PathElementSpecBase {
    type: 'param';
    name: string;
}

export interface PathElementRestSpec extends PathElementSpecBase {
    type: 'rest';
    name: string;
    value: Array<string>;
}

export type PathElementSpec = PathElementLiteralSpec | PathElementParamSpec | PathElementRestSpec;

// export interface RawRouteSpec {
//     path: Array<PathElement | string>;
//     captureExtraPath?: boolean;
//     captureExtraQuery?: boolean;
// }

export type PathSpec = Array<PathElementSpec>;

export interface QueryFieldSpecBase {
    type: 'literal' | 'param';
    name: string;
}

export interface QueryFieldSpecLiteral extends QueryFieldSpecBase {
    type: 'literal',
    value: string;
}

export interface QueryFieldSpecParam extends QueryFieldSpecBase {
    type: 'param',
    optional?: boolean;
}

export type QueryFieldSpec = QueryFieldSpecLiteral | QueryFieldSpecParam;

export interface QuerySpec {
    [key: string]: QueryFieldSpec;
}

export interface ParamsSpec {
    [key: string]: string;
}

export interface RouteSpec {
    path: PathSpec;
    view: string;
    captureExtraPath?: boolean;
    captureExtraSearch?: boolean;
    queryParams?: QuerySpec;
    params?: ParamsSpec;
}