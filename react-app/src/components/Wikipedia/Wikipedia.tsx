import React from 'react';
import marked from 'marked';
import { Alert, Tooltip } from 'antd';
import { CheckOutlined, WarningOutlined } from '@ant-design/icons';

import { WikipediaInfo } from './WikipediaClient';
import './Wikipedia.css';
import logo from './images/wikipedia-logo.svg';

export interface WikipediaProps {
    term: string;
    info: WikipediaInfo;
}

interface WikipediaState {
}

export default class Wikipedia extends React.Component<WikipediaProps, WikipediaState> {
    renderArticle() {
        const content = marked(this.props.info.introText);
        return <div style={{ overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: content }} />;
    }

    renderImage() {
        if (!this.props.info.imageUrl) {
            return (
                <div className="Wikipedia-empty-image">
                    <div className="-content">Image not found</div>
                </div>
            );
        }
        return (
            <div>
                <img src={this.props.info.imageUrl} style={{ width: '100%' }} alt={`${this.props.term}`} />
            </div>
        );
    }

    renderMatch() {
        if (this.props.info.exactMatch) {
            const message = (
                <React.Fragment>
                    <CheckOutlined style={{ color: 'green' }} /> Exact match on "
                    {this.props.info.matchingTerms.join(' ')}"
                </React.Fragment>
            );
            return <Alert type="success" message={message} />;
        } else {
            const message = (
                <React.Fragment>
                    <WarningOutlined style={{ color: 'orange' }} /> Inexact match on: "
                    {this.props.info.matchingTerms.join(' ')}"
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

    render() {
        return (
            <div className="Row scrollable">
                <div className="Col Col-grow-2 scrollable">
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                        <div style={{ flex: '1 1 0px' }}>{this.renderMatch()}</div>
                        <div style={{ flex: '0 0 auto', alignSelf: 'center', marginLeft: '10px' }}>
                            <div style={{ height: '32px', textAlign: 'center' }}>
                                <Tooltip title={this.renderWikipediaLogoCredit()}>
                                    <a href={this.props.info.pageUrl} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={logo}
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
                        {this.renderArticle()}
                    </div>
                </div>

                <div className="Col Col-grow-1" style={{ flex: '1 1 0px', marginLeft: '10px' }}>
                    {this.renderImage()}
                </div>
            </div>
        );
    }
}
