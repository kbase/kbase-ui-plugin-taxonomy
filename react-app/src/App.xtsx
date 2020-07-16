import React from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';
import { AppBase, AuthGate } from '@kbase/ui-components';
import './App.css';
import Dispatcher from './components/dispatcher';
import { Unsubscribe } from 'redux';
import { navigate } from './redux/actions';

const store = createReduxStore();

interface AppProps { }

interface AppState { }

export default class App<AppProps, AppState> extends React.Component {
    storeUnsubscribe: Unsubscribe | null;
    constructor(props: AppProps) {
        super(props);
        this.storeUnsubscribe = null;
    }
    componentDidMount() {
        let last: {
            view: string | null;
            params: { [key: string]: string };
        } = {
            view: null,
            params: {}
        };
        this.storeUnsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (!state) {
                return;
            }
            const {
                app: {
                    runtime: { navigation }
                },
                auth: { userAuthorization }
            } = state;

            // This is a bit of a cheat.
            if (!userAuthorization) {
                return;
            }

            const view = navigation.view;
            const params = navigation.params as { [key: string]: string };

            if (
                view !== last.view ||
                last.params === null ||
                Object.keys(params).some((key) => {
                    return params[key] !== last.params[key];
                })
            ) {
                last.params = params;
                last.view = view;
                // TODO: store may change but there is not navigation yet.
                if (params['relationEngineID']) {
                    store.dispatch(navigate(params['relationEngineID']) as any);
                }
            }
        });
    }
    componentWillUnmount() {
        if (this.storeUnsubscribe) {
            this.storeUnsubscribe();
        }
    }
    render() {
        return (
            <Provider store={store}>
                <AppBase>
                    <AuthGate required={true}>
                        <div className="App Col scrollable">
                            <Dispatcher />
                        </div>
                    </AuthGate>
                </AppBase>
            </Provider>
        );
    }
}
