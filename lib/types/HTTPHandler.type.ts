import { Endpoint } from "./Endpoint.type.js";

export type HTTPHandler = {
    GET?: Endpoint,
    POST?: Endpoint,
    PUT?: Endpoint,
    DELETE?: Endpoint
};