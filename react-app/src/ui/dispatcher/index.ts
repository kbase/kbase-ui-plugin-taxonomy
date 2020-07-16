import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { Dispatcher } from './view';
import { RootState } from '@kbase/ui-components';
import { StoreState } from '../../redux/store';

interface OwnProps { }

interface StateProps {
    token: string | null;
    rootState: RootState;
    view: string | null;
    path: Array<string>;
    params: Params;
}

export interface Params {
    [key: string]: string;
}
interface DispatchProps {
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        root: { state: rootState },
        app: {
            runtime: {
                navigation: {
                    view: navView, params: navParams
                }
            }
        }
    } = state;


    // Auth integration.
    let token;
    if (!userAuthorization) {
        token = null;
    } else {
        token = userAuthorization.token;
    }

    const params = {
        ...navParams
    };
    delete params.rest;
    delete params.view;

    const path = (() => {
        if (!params.rest) {
            return [];
        }
        return params.rest.split('/');
    })();

    const view = (() => {
        if (!navView) {
            return 'about';
        }
        return navView;
    })();

    return { token, rootState, view, path, params };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Dispatcher);
