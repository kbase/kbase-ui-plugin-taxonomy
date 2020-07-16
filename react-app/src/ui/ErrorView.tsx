import React from 'react';
import { UIError } from "../types/error";
import { Alert } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";

export interface ErrorViewProps {
    error: UIError;
}

interface ErrorViewState {

}

export default class ErrorView extends React.Component<ErrorViewProps, ErrorViewState> {
    renderMessage() {
        return <>
            <p>Error!</p>
            <p>
                <ExclamationCircleOutlined style={{ color: 'red' }} />
                {' '}
                {this.props.error.message}
            </p>
        </>;
    }
    render() {
        return (
            <Alert type="error" message={this.renderMessage()}></Alert>
        );
    }
}