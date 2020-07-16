import React from 'react';
import { Taxon, TaxonomyReference } from '../../../types/taxonomy';
import { Tooltip } from 'antd';
import './TaxonItem.css';
// import { relationEngineReferenceToNamespace } from '../../../types/transform';
import { ArrowRightOutlined } from '@ant-design/icons';

export interface Props {
    taxon: Taxon;
    isActive: boolean;
    selectTaxonRef: (ref: TaxonomyReference) => void;
    navigateToTaxonRef: (ref: TaxonomyReference) => void;
}

interface State {
    hovering: boolean;
}

export default class TaxonItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hovering: false
        };
    }
    clickTaxon() {
        this.props.selectTaxonRef(this.props.taxon.ref);
    }
    clickNavigateToTaxon() {
        // const fixedID = this.props.taxon.id.replace('/', ':');
        const hash = [
            'taxonomy',
            'taxon',
            this.props.taxon.ref.namespace,
            this.props.taxon.ref.id,
            String(this.props.taxon.ref.timestamp)
        ].join('/');
        // const hash = `review/${fixedID}`;
        // TODO: use the integration api?
        if (window.parent) {
            window.parent.location.hash = hash;
        } else {
            window.location.hash = hash;
        }
        // window.history.pushState({}, 'my title', `/#review/${this.props.taxon.id}`);
        // this.props.navigateToTaxonID(this.props.taxon.id);
    }

    onMouseEnter(ev: React.MouseEvent<HTMLDivElement>) {
        this.setState({ hovering: true });
    }

    onMouseLeave(ev: React.MouseEvent<HTMLDivElement>) {
        this.setState({ hovering: false });
    }

    renderOver() {
        return (
            <React.Fragment>
                <div className="TaxonItem-name" onClick={this.clickNavigateToTaxon.bind(this)}>
                    {this.props.taxon.name}
                </div>
                <div className="TaxonItem-inspector" onClick={this.clickTaxon.bind(this)}>
                    <ArrowRightOutlined />
                </div>
            </React.Fragment>
        );
    }

    renderActive() {
        return (
            <React.Fragment>
                <div className="TaxonItem-name" onClick={this.clickNavigateToTaxon.bind(this)}>
                    {this.props.taxon.name}
                </div>
                <div className="TaxonItem-inspector">
                    <ArrowRightOutlined />
                </div>
            </React.Fragment>
        );
    }

    renderNormal() {
        return (
            <React.Fragment>
                <div className="TaxonItem-name">{this.props.taxon.name}</div>
            </React.Fragment>
        );
    }

    renderItem() {
        if (this.props.isActive) {
            return this.renderActive();
        }
        if (this.state.hovering) {
            return this.renderOver();
        } else {
            return this.renderNormal();
        }
    }

    render() {
        const taxon = this.props.taxon;
        const classNames = ['TaxonItem'];
        if (this.props.isActive) {
            classNames.push('TaxonItem-active');
        }

        const tooltipTitle = (
            <div>
                <div style={{ borderBottom: '1px solid silver' }}>{taxon.name}</div>
                <div>{taxon.rank}</div>
            </div>
        );

        return (
            <Tooltip title={tooltipTitle} placement="right">
                <div
                    className={classNames.join(' ')}
                    key={this.props.taxon.ref.id}
                    onMouseEnter={this.onMouseEnter.bind(this)}
                    onMouseLeave={this.onMouseLeave.bind(this)}
                >
                    {this.renderItem()}
                </div>
            </Tooltip>
        );
    }
}
