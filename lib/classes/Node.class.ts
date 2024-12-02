import { EngineOptions } from "../types/EngineOptions.type.js";
import { Engine } from "./Engine.class.js";
import getPeerIdFromNode from "../modules/peer-id/getPeerIdFromNode.js";
import { RPCConnection } from "./RPCConnection.class.js";
import { YamuxStream } from "@chainsafe/libp2p-yamux/dist/src/stream";
import recursiveProxy from "../modules/proxies/recursiveProxy.js";
import { inspect } from "util";
import { CID } from "multiformats/dist/src";
import { DID } from "../types/DID.type.js";
import { createDID, decodeDID } from "@olptools/did";
import { DIDType } from "../enum/DIDType.enum.js";
import { Web3ContractDescriptor } from "../types/Web3ContractDescriptor.type.js";
import { ok } from "assert";
import { IPFSGetJSONOptions } from "../types/IPFSGetJSONOptions.type.js";
import { $ok } from "../exceptions.js";

export class Node {
    private engine: Engine;
    
    constructor (engine: Engine) {
        this.engine = engine;
    }

    async rpc<T = any> (did: string, protocol: string) {
        if (did === this.engine.did()) return this.selfRPC(protocol);
        
        const conn = await this.connect(did, protocol);

        return recursiveProxy((path, args) => {
            return conn.request(path.join("/"), args);
        }) as T;
    }

    selfRPC (protocol: string) {
        const handler = this.engine.rpcHandlers.find(handler => handler.protocolRoute === protocol);

        $ok(handler, "PROTOCOL_NOT_FOUND", { protocol });

        return recursiveProxy((path, args) => {
            return handler.handleSelfRequest({
                path,
                params: args
            })
        });  
    }

    async connect (did: string, protocol: string) { 
        const peerId = getPeerIdFromNode(did);

        const connection = await this.engine.p2p.libp2p.dialProtocol(peerId, protocol) as YamuxStream;

        return new RPCConnection(this.engine.network.did, connection, did);
    }

    get did () {
        return this.engine.did() as DID;
    }

    network () {
        return this.engine.network.did;
    }

    async get<T> (cid: string | CID, options?: IPFSGetJSONOptions) {
        return await this.engine.ipfs.getJSON<T>(cid, options);
    }

    async save (data: any, { pin }: { pin: boolean } = { pin: false }) {
        return await this.engine.ipfs.saveJSON(data);
    }

    async contract (did: string) {
        const { content } = decodeDID(DIDType.Web3Contract, did); 
        const { address, abi } = await this.get<Web3ContractDescriptor>(content);

        ok(address, "Contract address not found.");
        ok(abi, "Contract abi not found.");

        return this.engine.web3.contract(address, abi);
    }

    async address () {
        return this.engine.keyStorage.address();
    }

    async publishContract (address: string, abi: any) {
        const cid = await this.save(<Web3ContractDescriptor>{
            address,
            abi
        });

        return createDID(DIDType.Web3Contract, cid.toString());
    }

    async peers () {
        return this.engine.p2p.peers();
    }

    static async create (options: EngineOptions) {
        const engine = await Engine.create(options);
        const node = new Node(engine);
        
        engine.setNode(node);

        return node;
    }

    [inspect.custom] () {
        return this.did;
    }

    toString () {
        return this.did;
    }

}