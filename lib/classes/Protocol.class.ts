import { IncomingStreamData } from "@libp2p/interface";
import { ProtocolDefinition } from "../types/ProtocolDefinition.type";
import { YamuxStream } from "@chainsafe/libp2p-yamux/dist/src/stream";
import { Connection } from "./Connection.class.js";
import { Subject } from "rxjs";
import { inspect } from "util";

export class Protocol {
    name: string;
    version: string;
    
    private _p2pEndpoints: Record<string, any>;
    private _httpEndpoints: Record<string, any>;

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