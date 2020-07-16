import React from 'react';

import marked from 'marked';
import { Alert, Tooltip } from 'antd';
import './Wikipedia.css';
import { CheckOutlined, WarningOutlined } from '@ant-design/icons';
import Loading from '../ui/Loading';
import WikipediaClient, { WikipediaInfo } from './views/taxon/lib/Wikipedia';

export interface WikipediaProps {
    term: string;
}

enum AsyncComponentLoadingState {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

interface StateNone {
    state: AsyncComponentLoadingState.NONE;
}

interface StateLoading {
    state: AsyncComponentLoadingState.LOADING;
}

interface StateLoaded {
    state: AsyncComponentLoadingState.LOADED;
    wikipediaInfo: WikipediaInfo;
}

interface StateError {
    state: AsyncComponentLoadingState.ERROR;
    error: string;
}

type WikipediaState = StateNone | StateLoading | StateLoaded | StateError;

export default class Wikipedia extends React.Component<WikipediaProps, WikipediaState> {
    wikipediaClient: WikipediaClient;
    canceled: boolean;
    constructor(props: WikipediaProps) {
        super(props);
        this.wikipediaClient = new WikipediaClient();
        this.canceled = false;
        this.state = {
            state: AsyncComponentLoadingState.NONE
        };
    }

    componentWillUnmount() {
        this.canceled = true;
        // this.state = {
        //     state: AsyncComponentLoadingState.CANCELED
        // };
    }

    renderArticle(wikipediaInfo: WikipediaInfo) {
        const content = marked(wikipediaInfo.introText);
        return <div style={{ overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: content }} />;
    }

    renderImage(wikipediaInfo: WikipediaInfo) {
        if (!wikipediaInfo.imageUrl) {
            return (
                <div className="Wikipedia-empty-image">
                    <div className="-content">Image not found</div>
                </div>
            );
        }
        return (
            <div>
                <img src={wikipediaInfo.imageUrl} style={{ width: '100%' }} alt={`${this.props.term}`} />
            </div>
        );
    }

    renderMatch(wikipediaInfo: WikipediaInfo) {
        if (wikipediaInfo.exactMatch) {
            const message = (
                <React.Fragment>
                    <CheckOutlined style={{ color: 'green' }} /> Exact match on "
                    {wikipediaInfo.matchingTerms.join(' ')}"
                </React.Fragment>
            );
            return <Alert type="success" message={message} />;
        } else {
            const message = (
                <React.Fragment>
                    <WarningOutlined style={{ color: 'orange' }} /> Inexact match on: "
                    {wikipediaInfo.matchingTerms.join(' ')}"
                </React.Fragment>
            );
            return <Alert type="warning" message={message} />;
        }
    }

    renderWikipediaLogoCredit() {
        return (
            <div>
                <div style={{ borderBottom: '1px solid gray' }}>Link to the original Wikipedia entry</div>
                <div style={{ fontSize: '80%' }}>
                    <p style={{ textAlign: 'center' }}>
                        credit:
                        <a
                            href="https://creativecommons.org/licenses/by-sa/3.0/"
                            title="Creative Commons Attribution-ShareAlike 3.0"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            CC BY-SA 3.0
                        </a>
                        <a
                            href="https://en.wikipedia.org/w/index.php?curid=33285413"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Link
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    renderWikipediaInfo(wikipediaInfo: WikipediaInfo) {
        return (
            <div className="Row scrollable">
                <div className="Col Col-grow-2 scrollable">
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                        <div style={{ flex: '1 1 0px' }}>{this.renderMatch(wikipediaInfo)}</div>
                        <div style={{ flex: '0 0 auto', alignSelf: 'center', marginLeft: '10px' }}>
                            <div style={{ height: '32px', textAlign: 'center' }}>
                                <Tooltip title={this.renderWikipediaLogoCredit()}>
                                    <a href={wikipediaInfo.pageUrl} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src="images/wikipedia-logo.svg"
                                            style={{ height: '100%' }}
                                            alt="Wikipedia Logo"
                                        />
                                    </a>
                                </Tooltip>
                            </div>
                            <div />
                        </div>
                    </div>
                    <div
                        className="scrollable"
                        style={{ flex: '2 1 0px', paddingRight: '4px', marginRight: '4px', overflowY: 'auto' }}
                    >
                        {this.renderArticle(wikipediaInfo)}
                    </div>
                </div>

                <div className="Col Col-grow-1" style={{ flex: '1 1 0px', marginLeft: '10px' }}>
                    {this.renderImage(wikipediaInfo)}
                </div>
            </div>
        );
    }

    updateInfo() {
        const wikipediaClient = new WikipediaClient();
        const { term } = this.props;
        this.setState({
            state: AsyncComponentLoadingState.LOADING
        });
        wikipediaClient
            .findTerm(term)
            .then((wikipediaInfo) => {
                if (this.canceled) {
                    return;
                }
                this.setState({
                    state: AsyncComponentLoadingState.LOADED,
                    wikipediaInfo
                });
            })
            .catch((err) => {
                if (this.canceled) {
                    return;
                }
                return this.setState({
                    state: AsyncComponentLoadingState.ERROR,
                    error: err.message
                });
            });
    }

    componentDidMount() {
        this.updateInfo();
    }

    componentDidUpdate(props: WikipediaProps, state: WikipediaState) {
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

    renderLoaded(state: StateLoaded) {
        return this.renderWikipediaInfo(state.wikipediaInfo);
    }

    renderError(state: StateError) {
        return <Alert type="error" message={state.error} />;
    }

    render() {
        if (this.canceled) {
            return;
        }
        switch (this.state.state) {
            case AsyncComponentLoadingState.NONE:
                return this.renderNone();
            case AsyncComponentLoadingState.LOADING:
                return this.renderLoading();
            case AsyncComponentLoadingState.LOADED:
                return this.renderLoaded(this.state);
            case AsyncComponentLoadingState.ERROR:
                return this.renderError(this.state);
        }
    }
}
