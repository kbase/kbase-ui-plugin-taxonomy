import React from 'react';
import { Unsubscribe } from 'redux';
import { RootState } from '@kbase/ui-components';
import { Navigation } from '@kbase/ui-components/lib/redux/integration/store';
import { Router } from './Router';
import RequestFetcher from './Request';
import { RouteSpec } from './RouteSpec';

export interface NavigationListenerProps {
    routes: Array<RouteSpec>;
    rootState: RootState;
    // navigationView: NavigationView;
    trigger: number;
    navigation: Navigation;
    navigate: (nav: Navigation) => void;
}

interface NavigationListenerState {
}

interface Params {
    [k: string]: string;
};

export default class NavigationListener extends React.Component<NavigationListenerProps, NavigationListenerState> {
    storeUnsubscribe: Unsubscribe | null;
    last: Navigation;
    router: Router;
    constructor(props: NavigationListenerProps) {
        super(props);
        this.storeUnsubscribe = null;
        this.last = {
            // path: [],
            view: '',
            params: {}
        };
        this.router = new Router();
        props.routes.forEach((route) => {
            this.router.addRoute(route);
        });
    }

    navigateWithHash() {
        const request = new RequestFetcher().getHashRequest();
        const { route, params } = this.router.findRoute(request);
        this.props.navigate({
            view: route.view,
            params
        });
    }

    setupListener() {
        if (this.props.rootState === RootState.DEVELOP) {
            // Navigate on change of the hash
            window.addEventListener('hashchange', (ev: HashChangeEvent) => {
                const url = new URL(ev.newURL);
                const hash = url.hash;
                if (!hash) {
                    throw new Error('no hash!');
                }
                this.navigateWithHash();
            });

            // First time here, we also want to navigate based on the
            // hash, or if empty (the default when a dev session starts)
            // use some default interesting taxon id.

            // don't do initial nav for now
            // return;
            const hash = window.location.hash;
            if (!hash) {
                throw new Error('no hash!');
            }

            this.navigateWithHash();
        }
    }

    componentDidMount() {
        this.setupListener();
    }
    render() {
        return this.props.children;
    }
}