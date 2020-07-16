export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONArray extends Array<JSONValue> { };

export interface JSONObject {
    [x: string]: JSONValue
}