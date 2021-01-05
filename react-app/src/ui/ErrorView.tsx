import React from 'react';
import { UIError } from "../types/error";
import { Alert } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";

export interface ErrorViewProps {
    title?: string;
    error: UIError;
}

interface ErrorViewState {

}

export default class ErrorView extends React.Component<ErrorViewProps, ErrorViewState> {
    renderMessage() {
        return <>
            <p>{this.props.title || 'Error!'}</p>
            <p>
                <ExclamationCircleOutlined style={{ color: 'red' }} />
                {' '}
                {this.props.error.message}
            </p>

            <p>Code: <span>{this.props.error.code}</span></p>
            <p>Source: <span>{this.props.error.source}</span></p>
        </>;
    }
    render() {
        return (
            <Alert type="error" message={this.renderMessage()}></Alert>
        );
    }
}