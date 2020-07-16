import { AppConfig } from '@kbase/ui-components';
import { StoreState } from '../../../../../redux/store';
import DataComponent from './data';
import { connect } from 'react-redux';

export interface OwnProps { }

export interface StateProps {
    token: string;
    config: AppConfig;
}

export interface DispatchProps { }

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        app: { config }
    } = state;
    if (!userAuthorization) {
        throw new Error('Invalid state - no user authorization');
    }
    return {
        token: userAuthorization.token,
        config
    };
}

function mapDispatchToProps() {
    return {};
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(DataComponent);
