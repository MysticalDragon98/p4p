import { inspect } from "util";
import { HTTPEndpoints } from "../types/HTTPEndpoints.type";
import { ProtocolDefinition } from "../types/ProtocolDefinition";
import { P2PEndpoints } from "../types/P2PEndpoints";

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

    httpEndpoints () {
        return {
            [this.name]: {
                [this.version]: this._httpEndpoints
            }
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