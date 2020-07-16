import * as json from './json';

export interface UIError {
    code: string;
    source: string;
    message: string;
    data?: json.JSONValue;
}

export class UIException extends Error {
    code: string;
    source: string;
    message: string;
    data?: json.JSONValue;
    constructor({ message, code, source, data }: { message: string, code: string, source: string, data?: json.JSONValue }) {
        super(message);
        this.code = code;
        this.source = source;
        this.message = message;
        this.data = data;
    }
}