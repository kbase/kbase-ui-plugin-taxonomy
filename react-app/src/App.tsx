import React from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from './redux/store';
import { AppBase, AuthGate } from '@kbase/ui-components';
import './App.css';
import ErrorBoundary from './ui/ErrorBoundary';
import Dispatcher from './ui/dispatcher';

const store = createReduxStore();

interface AppProps { }

interface AppState { }

export default class App<AppProps, AppState> extends React.Component {
    render() {
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <AppBase>
                        <AuthGate required={true}>
                            <div className="App Col scrollable">
                                <Dispatcher />
                            </div>
                        </AuthGate>
                    </AppBase>
                </Provider>
            </ErrorBoundary>
        );
    }
}
