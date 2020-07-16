import React from 'react';
import { Spin } from 'antd';
import './Loading.css';

export interface Props {
    message: string;
}

interface State { }

export default class Loading extends React.Component<Props, State> {
    render() {
        return (
            <div className="Loading-box">
                <Spin size="large" />
                <br />
                {this.props.message}
            </div>
        );
    }
}
