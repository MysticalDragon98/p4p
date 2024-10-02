import { Endpoint } from "../../types/Endpoint.type";

export default function resolveEndpoint (path: string[], endpoints: any) {
    let fn: object | Function = endpoints;

    for (const segment of path) {
        fn = fn?.[segment];
    }

    if (typeof fn !== "function") {
        return null;
    }

    return fn as Endpoint<any>;
}