import { Endpoint } from "./Endpoint.type.js";

export type HTTPHandler = {
    GET?: Endpoint<any>,
    POST?: Endpoint<any>,
    PUT?: Endpoint<any>,
    DELETE?: Endpoint<any>
};