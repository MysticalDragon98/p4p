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
    public rpcHandlers: P2PRPCHandler[] = [];
    public web3?: Web3;

    public constructor (keyStorage: KeyStorage, p2pNode: P2PNode, ipfsNode: IPFSNode, network: Network, httpServer: HTTPServer, web3?: Web3) {
        this.keyStorage = keyStorage;
        this.p2p = p2pNode;
        this.ipfs = ipfsNode;
        this.network = network;
        this.http = httpServer;
        this.web3 = web3;
    } 

    static async create (options: EngineOptions) {
        return await createEngine(options);
    }

    addProtocol (protocol: Protocol) {
        this.http.addProtocol(protocol);
        const rpcHandler = new P2PRPCHandler(this, protocol);
        
        this.p2p.libp2p.handle(`/${protocol.name}/${protocol.version}`, rpcHandler.handle.bind(rpcHandler));
        this.rpcHandlers.push(rpcHandler);
    }

    setNode (node: Node) {
        this.http.setNode(node);
        
        for (const handler of this.rpcHandlers) {
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
import { Web3 } from "./Web3.class.js";
