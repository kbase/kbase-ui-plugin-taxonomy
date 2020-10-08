import React from 'react';
import { RootState, AppError } from '@kbase/ui-components';
import { Alert } from 'antd';
import { Params } from '.';
import TaxonView from '../../components/views/taxon';
import Navigation from '../navigation';
import { RouteConfig, routeConfigToSpec } from '../navigation/RouteConfig';
import { TaxonomyReference, TaxonomyNamespace } from '../../types/taxonomy';

const routes: Array<RouteConfig> = [
    {
        path: "taxonomy/taxon/:namespace/:id/:-timestamp?tab=:-tab",
        view: 'taxon'
    },
    {
        path: 'taxonomy/about',
        view: 'about'
    },
    {
        path: 'taxonomy/help',
        view: 'help'
    }
];

function stringToNamespace(s: string): TaxonomyNamespace {
    return s;
}

export interface ViewRouter {
    view: string;
    router: (path: Array<string>, params: Params) => React.ReactNode;
}

export interface ViewRouters {
    [key: string]: ViewRouter;
}

export interface DispatcherProps {
    token: string | null;
    rootState: RootState;
    view: string | null;
    path: Array<string>;
    params: Params;
}

interface DispatcherState {
    view: string | null;
    path: Array<string>;
    params: Params;
    currentRoute: ViewRouter | null;
}

export class Dispatcher extends React.Component<DispatcherProps, DispatcherState> {
    views: ViewRouters;

    constructor(props: DispatcherProps) {
        super(props);

        this.views = {
            about: {
                view: 'about',
                router: (path: Array<string>, params: Params) => {
                    return <div>About here...</div>;
                }
            },
            help: {
                view: 'help',
                router: (path: Array<string>, params: Params) => {
                    return <div>Help here...</div>;
                }
            },
            taxon: {
                view: 'taxon',
                router: (path: Array<string>, params: Params) => {
                    // const [namespace, term] = path;
                    if (!params.id) {
                        throw new Error('No id!!');
                    }
                    const ref: TaxonomyReference = {
                        namespace: stringToNamespace(params.namespace),
                        id: params.id
                    };
                    return <TaxonView taxonRef={ref} />;
                }
            }
        };

        this.state = {
            view: this.props.view,
            path: this.props.path,
            params: this.props.params,
            currentRoute: null
        };
    }

    renderUnauthorized() {
        return <div>Sorry, not authorized. Please log in first.</div>;
    }

    renderRootState() {
        switch (this.props.rootState) {
            case RootState.NONE:
                return '';
            case RootState.HOSTED:
                return '';
            case RootState.DEVELOP:
                return '';
            case RootState.ERROR:
                return 'error';
        }
    }

    renderNavigationNone() {
        const message = <div>
            NONE
        </div>;
        return <Alert type="error" message={message} />;
    }

    // componentDidMount() {
    //     if (this.props.view === null) {
    //         return;
    //     }

    //     const route = this.routes[this.props.view];

    //     if (!route) {
    //         return;
    //     }

    //     this.setState({
    //         currentRoute: route
    //     });
    // }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message} />;
    }

    renderNotFound(view: string) {
        return <Alert type="warning" message={`Not Found: ${view}`} />;
    }

    renderEmptyRoute() {
        return <div>
            Sorry, empty route.
        </div>;
    }

    renderRoute() {
        if (!this.props.view) {
            return this.renderEmptyRoute();
        }
        const route = this.views[this.props.view];
        if (!route) {
            return this.renderEmptyRoute();
        }
        return route.router(this.props.path, this.props.params);
    }

    renderRouting() {
        if (!this.props.token) {
            return this.renderUnauthorized();
        }
        return this.renderRoute();
    }

    render() {
        if (this.props.rootState === RootState.DEVELOP) {
            const routeSpecs = routes.map(routeConfigToSpec);
            return <Navigation routes={routeSpecs}>
                {this.renderRouting()}
            </Navigation>;
        } else {
            return this.renderRouting();
        }
    }
}
