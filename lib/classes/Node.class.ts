import { EngineOptions } from "../types/EngineOptions.type";
import { Engine } from "./Engine.class.js";
import getPeerIdFromNodeDID from "../modules/peer-id/getPeerIdFromNodeDID.js";
import { RPCConnection } from "./RPCConnection.class.js";
import { YamuxStream } from "@chainsafe/libp2p-yamux/dist/src/stream";
import recursiveProxy from "../modules/proxies/recursiveProxy.js";
import { inspect } from "util";
import { CID } from "multiformats/dist/src";

export class Node {
    engine: Engine;
    
    constructor (engine: Engine) {
        this.engine = engine;
    }

    async rpc<T> (did: string, protocol: string) {
        const conn = await this.connect(did, protocol);

        return recursiveProxy((path, args) => {
            return conn.request(path.join("/"), args);
        }) as T;
    }

    async connect (did: string, protocol: string) { 
        const peerId = getPeerIdFromNodeDID(did);

        const connection = await this.engine.p2p.libp2p.dialProtocol(peerId, protocol) as YamuxStream;

        return new RPCConnection(this.engine.network.did, connection);
    }

    get did () {
        return this.engine.did();
    }

    network () {
        return this.engine.network.did;
    }

    async get (cid: string | CID, { pin }: { pin: boolean } = { pin: false }) {
        return await this.engine.ipfs.getJSON(cid, { pin });
    }

    async save (data: any, { pin }: { pin: boolean } = { pin: false }) {
        return await this.engine.ipfs.saveJSON(data);
    }

    static async create (options: EngineOptions) {
        const engine = await Engine.create(options);

        return new Node(engine);
    }

    [inspect.custom] () {
        return this.did;
    }

    toString () {
        return this.did;
    }

}