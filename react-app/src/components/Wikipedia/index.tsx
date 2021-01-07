import React from 'react';
import { Alert } from 'antd';
import Loading from 'ui/Loading';

import WikipediaClient, { WikipediaInfo } from './WikipediaClient';
import {
    AsyncComponent, AsyncComponentError, AsyncComponentLoaded, AsyncComponentState
} from '../../types/AsyncComponent';
import { SimpleError } from '../../types';
import Wikipedia from './Wikipedia';

export interface WikipediaLoaderProps {
    term: string;
}

interface WikipediaLoaderComponentState {
    info: WikipediaInfo;
}

type WikipediaState = AsyncComponent<WikipediaLoaderComponentState, SimpleError>;

export default class WikipediaLoader extends React.Component<WikipediaLoaderProps, WikipediaState> {
    wikipediaClient: WikipediaClient;
    canceled: boolean;
    constructor(props: WikipediaLoaderProps) {
        super(props);
        this.wikipediaClient = new WikipediaClient();
        this.canceled = false;
        this.state = {
            state: AsyncComponentState.NONE
        };
    }

    componentWillUnmount() {
        this.canceled = true;
        // this.state = {
        //     state: AsyncComponentLoadingState.CANCELED
        // };
    }

    updateInfo() {
        const wikipediaClient = new WikipediaClient();
        const { term } = this.props;
        this.setState({
            state: AsyncComponentState.LOADING
        });
        wikipediaClient
            .findTerm(term)
            .then((info) => {
                if (this.canceled) {
                    return;
                }
                this.setState({
                    state: AsyncComponentState.LOADED,
                    value: { info }
                });
            })
            .catch((err) => {
                if (this.canceled) {
                    return;
                }
                return this.setState({
                    state: AsyncComponentState.ERROR,
                    error: {
                        message: err.message
                    }
                });
            });
    }

    componentDidMount() {
        this.updateInfo();
    }

    componentDidUpdate(props: WikipediaLoaderProps, state: WikipediaState) {
        if (props.term !== this.props.term) {
            this.updateInfo();
        }
    }

    renderNone() {
        return <div />;
    }

    renderLoading() {
        return <Loading message="Searching Wikipedia..." />;
    }

    renderLoaded(state: AsyncComponentLoaded<WikipediaLoaderComponentState>) {
        return <Wikipedia term={this.props.term} info={state.value.info} />;
    }

    renderError(state: AsyncComponentError<SimpleError>) {
        return <Alert type="error" message={state.error.message} />;
    }

    render() {
        if (this.canceled) {
            return;
        }
        switch (this.state.state) {
            case AsyncComponentState.NONE:
                return this.renderNone();
            case AsyncComponentState.LOADING:
                return this.renderLoading();
            case AsyncComponentState.LOADED:
                return this.renderLoaded(this.state);
            case AsyncComponentState.ERROR:
                return this.renderError(this.state);
        }
    }
}
