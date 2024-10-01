import { IPFSNode } from "./IPFSNode.class.js";
import { KeyStorage } from "./KeyStorage.class.js";
import { P2PNode } from "./P2PNode.class.js";
import { DIDType } from "../enum/DIDType.enum.js";
import { Network } from "./Network.class.js";
import { inspect } from "util";
import { HTTPServer } from "./HTTPServer.class.js";
import { EngineOptions } from "../types/EngineOptions.type.js";
import createEngine from "../modules/engines/createEngine.js";
import { P2PRPCHandler } from "./P2PRPCHandler.class.js";
import { createDID } from "@olptools/did";
import { Protocol } from "./Protocol.class.js";

export class Engine {
    public keyStorage: KeyStorage;
    public p2p: P2PNode;
    public ipfs: IPFSNode;
    public network: Network;
    public http: HTTPServer;
    private handlers: P2PRPCHandler[] = [];

    public constructor (keyStorage: KeyStorage, p2pNode: P2PNode, ipfsNode: IPFSNode, network: Network, httpServer?: HTTPServer) {
        this.keyStorage = keyStorage;
        this.p2p = p2pNode;
        this.ipfs = ipfsNode;
        this.network = network;
        this.http = httpServer;
    } 

    static async create (options: EngineOptions) {
        return await createEngine(options);
    }

    addProtocol (protocol: Protocol) {
        this.http.addEndpoints(protocol.httpEndpoints());

        const rpcHandler = new P2PRPCHandler(this, protocol.p2pEndpoints());
        
        this.p2p.libp2p.handle(`/${protocol.name}/${protocol.version}`, rpcHandler.handle.bind(rpcHandler));
        this.handlers.push(rpcHandler);
    }

    setNode (node: Node) {
        this.http.setNode(node);
        
        for (const handler of this.handlers) {
            handler.setNode(node);
        }
    }

    did () {
        return createDID(DIDType.Node, Buffer.from(this.keyStorage.pubkey().raw).toString('base64'));
    }

    toString () { return this.did(); }
    [inspect.custom] () { return this.did(); }
    
}

import { Node } from "./Node.class.js";