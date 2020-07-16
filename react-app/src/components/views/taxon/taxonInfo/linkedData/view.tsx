import React from 'react';
import { LinkedObject, WorkspaceType, WorkspaceObjectType } from '../../../../../lib/TaxonomyModel';
import { Table, Tooltip, Spin, Alert } from 'antd';
import Column from 'antd/lib/table/Column';
import { LinkedObjectsCollection, LinkedObjectsData } from './LinkedDataDB';
import { DBCollectionStatus } from '../../../../../lib/DB2';
import { UIError } from '../../../../../types/error';
import { SortSpec, stringToSortDirection } from './LinkedDataDB';
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';

const DEFAULT_PAGE_SIZE = 12;

export interface Props {
    linkedObjectsCollection: LinkedObjectsCollection;
    setPage: (page: number, pageSize: number) => void;
    updateView: (page: number, pageSize: number, sort: SortSpec | null) => void;
}

interface State { }

export default class LinkedData extends React.Component<Props, State> {
    onChangePage(page: number, pageSize?: number) {
        this.props.setPage(page, pageSize || DEFAULT_PAGE_SIZE);
    }

    onChangeTable(
        pagination: TablePaginationConfig,
        filters: Partial<Record<keyof LinkedObject, string[]>>,
        sorters: SorterResult<LinkedObject> | Array<SorterResult<LinkedObject>>
    ) {
        let sort: SortSpec | null;
        // TODO: work with the array of sorters!
        let sorter;
        if (Array.isArray(sorters)) {
            if (sorters.length > 0) {
                sorter = sorters[0];
            } else {
                sort = null;
            }
        } else {
            sorter = sorters;
        }
        if (sorter && sorter.column && sorter.column.dataIndex && typeof sorter.column.dataIndex === 'string') {
            const sortColumn = sorter.column.dataIndex;
            const sortDirection = stringToSortDirection(sorter.order === 'descend' ? 'descending' : 'ascending');
            sort = {
                sortColumn, sortDirection
            };
        } else {
            sort = null;
        }

        this.props.updateView(pagination.current || 1, pagination.pageSize || DEFAULT_PAGE_SIZE, sort);
    }

    componentDidMount() {
        this.props.setPage(1, DEFAULT_PAGE_SIZE);
    }

    componentDidUpdate(previousProps: Props) {
        switch (previousProps.linkedObjectsCollection.status) {
            case DBCollectionStatus.NONE:
            case DBCollectionStatus.LOADING:
            case DBCollectionStatus.LOADED:
            case DBCollectionStatus.ERROR:
            case DBCollectionStatus.RELOADING:
        }
    }

    renderLinkedObjects(data: LinkedObjectsData, isLoading: boolean) {
        return <Table<LinkedObject>
            dataSource={data.linkedObjects}
            size="small"
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            // pagination={false}
            // scroll={{ y: '100%' }}
            bordered={false}
            rowKey={(linkedObject: LinkedObject) => {
                return [linkedObject.workspaceID, linkedObject.objectID, linkedObject.version].join('/');
            }}
            pagination={{
                position: ['topLeft'],
                // onChange: this.onChangePage.bind(this),
                defaultPageSize: DEFAULT_PAGE_SIZE,
                total: data.totalCount
            }}
            loading={isLoading}
            onChange={this.onChangeTable.bind(this)}
        >
            <Column
                title="Type"
                dataIndex="type"
                width="10%"
                render={(type: WorkspaceObjectType) => {
                    const typeID = [[type.module, type.name].join('.'), [type.majorVersion, type.minorVersion].join('.')].join('-');
                    return <a href={`/#spec/type/${typeID}`} target="_blank" rel="noopener noreferrer">
                        {type.name}
                    </a>;
                }}
            />
            <Column
                title="Object"
                dataIndex="objectName"
                width="35%"
                // sorter={(a: LinkedObject, b: LinkedObject) => {
                //     return a.objectName.localeCompare(b.objectName);
                // }}
                sorter={true}
                render={(objectName: string, linkedObject: LinkedObject) => {
                    const url = [
                        '',
                        '#dataview',
                        linkedObject.workspaceID,
                        linkedObject.objectID,
                        linkedObject.version
                    ].join('/');
                    const headerStyle = {
                        fontStyle: 'italic',
                        marginRight: '3px'
                    };
                    const tooltip = (
                        <div>
                            <div>
                                <span style={headerStyle}>
                                    Ref
                                </span>
                                <span>
                                    {linkedObject.workspaceID}/{linkedObject.objectID}/{linkedObject.version}
                                </span>
                            </div>
                            <div>
                                <span style={headerStyle}>
                                    Workspace ID
                                </span>
                                <span>
                                    {linkedObject.workspaceID}
                                </span>
                            </div>
                            <div>
                                <span style={headerStyle}>
                                    Object ID
                                </span>
                                <span>
                                    {linkedObject.objectID}
                                </span>
                            </div>
                            <div>
                                <span style={headerStyle}>
                                    Version
                                </span>
                                <span>
                                    {linkedObject.version}
                                </span>
                            </div>
                        </div>
                    );
                    return (
                        <Tooltip title={tooltip}>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                {objectName}
                            </a>
                        </Tooltip>
                    );
                }}
            />
            <Column
                title="Narrative"
                width="35%"
                dataIndex="workspaceID"
                render={(workspaceID: number, linkedObject: LinkedObject) => {
                    switch (linkedObject.workspaceType) {
                        case WorkspaceType.NARRATIVE:
                            return <a href={`/narrative/${workspaceID}`} target="_blank" rel="noopener noreferrer">
                                {linkedObject.title}
                            </a>;
                        case WorkspaceType.REFDATA:
                            return <span>{linkedObject.title}</span>;
                        case WorkspaceType.UNKNOWN:
                            return <span>{linkedObject.title}</span>;

                    }

                }}
            />
            <Column
                title="Object Created"
                dataIndex="createdAt"
                width="10%"
                // sorter={(a: LinkedObject, b: LinkedObject) => {
                //     return a.createdAt - b.createdAt;
                // }}
                sorter={true}
                render={(createdAt: number) => {
                    return Intl.DateTimeFormat('en-US').format(createdAt);
                }}
            />
            <Column
                title="Linked At"
                dataIndex="linkedAt"
                width="10%"
                // sorter={(a: LinkedObject, b: LinkedObject) => {
                //     return a.linkedAt - b.linkedAt;
                // }}
                sorter={true}
                defaultSortOrder='descend'
                render={(linkedAt: number) => {
                    return Intl.DateTimeFormat('en-US').format(linkedAt);
                }}
            />
        </Table>;
    }
    renderLoading() {
        return (
            <Spin />
        );
    }
    renderError(error: UIError) {
        return (
            <Alert type="error" message={error.message} />
        );
    }
    render() {
        const collection = this.props.linkedObjectsCollection;
        switch (collection.status) {
            case DBCollectionStatus.NONE:
                return this.renderLoading();
            case DBCollectionStatus.ERROR:
                return this.renderError(collection.error);
            case DBCollectionStatus.LOADING:
                return this.renderLinkedObjects(collection.data, true);
            case DBCollectionStatus.LOADED:
                return this.renderLinkedObjects(collection.data, false);
            case DBCollectionStatus.RELOADING:
                return this.renderLinkedObjects(collection.data, true);
        }
    }
}
