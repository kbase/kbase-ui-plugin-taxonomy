export interface ObjectType {
    module: string;
    name: string;
    version: {
        major: number;
        minor: number;
    }
}

export enum WorkspaceType {
    NARRATIVE,
    REFDATA,
    UNKNOWN
}

export interface LinkedObjects {
    object: {
        id: number;
        version: number;
        name: string;
        type: ObjectType;
        createdAt: number;
    },
    workspace: {
        id: number;
        type: WorkspaceType;
        title: string;
    }
    linkedAt: number;
}
