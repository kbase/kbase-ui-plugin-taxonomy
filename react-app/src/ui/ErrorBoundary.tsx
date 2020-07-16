import React from 'react';
import { Alert } from 'antd';

export interface ErrorBoundaryProps {

}

interface ErrorBoundaryState {
    error: null | {
        message: string;
    };
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            error: null
        };
    }

    renderError() {
        if (this.state.error === null) {
            return;
        }
        return <Alert type="error" message={
            <div>
                <p>Error!</p>
                <p>{this.state.error.message}</p>
            </div>
        } />;
    }

    static getDerivedStateFromError(error: any) {
        if (error.message) {
            return {
                error: {
                    message: error.message
                }
            };
        } else if (typeof error === 'string') {
            return {
                error: {
                    message: error
                }
            };
        } else {
            return {
                error: {
                    message: 'Unknown error'
                }
            };
        }
    }

    render() {
        if (this.state.error) {
            return this.renderError();
        }
        return this.props.children;
    }
}