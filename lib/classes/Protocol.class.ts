import { inspect } from "util";
import { HTTPEndpoints } from "../types/HTTPEndpoints.type.js";
import { ProtocolDefinition } from "../types/ProtocolDefinition.js";
import { P2PEndpoints } from "../types/P2PEndpoints.js";
import { HTTPMethod } from "../enum/HTTPMethod.enum.js";
import resolveEndpoint from "../modules/utils/resolveEndpoint.js";
import raise from "../modules/utils/raise.js";
import { Node } from "./Node.class.js";
import { P2PRPCRequest } from "../types/P2PRPCRequest.type.js";

export class Protocol {
    name: string;
    version: string;
    
    private _p2pEndpoints: P2PEndpoints;
    private _httpEndpoints: HTTPEndpoints;

    constructor (definition: ProtocolDefinition) {
        this.name = definition.name;
        this.version = definition.version;

        this._p2pEndpoints = definition.p2pEndpoints;
        this._httpEndpoints = definition.httpEndpoints;
    }

    p2pEndpoints () {
        return this._p2pEndpoints;
    }

    async handleHTTPRequest ({ path, method, params, node, did }: { path: string[], method: HTTPMethod, params: any, node?: Node, did: string }) {
        const fn = resolveEndpoint([ ...path, method ], this._httpEndpoints);

        if (!fn) raise("ENOTFOUND", "Method not found.");

        try {
            const result = await fn(params, {
                node,
                protocol: this,
                did
            });

            return result;
        } catch (error) {
            raise(error.code ?? "INTERNAL_ERROR", error.message ?? error.toString());
            return;
        }
    }

    async handleP2PRequest ({ message, node, did }: { message: P2PRPCRequest, node?: Node, did: string }) {
        const fn = resolveEndpoint(message.method.split("/"), this._p2pEndpoints);

        if (!fn) raise("ENOTFOUND", "Method not found.");

        try {
            const result = await fn(message.params[0], { node, protocol: this, did });
            
            return result;
        } catch (error) {
            raise(error.code ?? "INTERNAL_ERROR", error.message ?? error.toString());
            return;
        }
    }

    route () {
        return `/${this.name}/${this.version}`;
    }

    [inspect.custom] () {
        return `Protocol(/${this.name}/${this.version})`;
    }

    toString () {
        return this[inspect.custom]();
    }
}

export type { ProtocolDefinition };