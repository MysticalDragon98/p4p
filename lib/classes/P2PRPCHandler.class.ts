import { Subject, Subscription } from "rxjs";
import { IncomingStreamData } from "@libp2p/interface";
import { YamuxStream } from "@chainsafe/libp2p-yamux/src/stream";
import { RPCConnection } from "./RPCConnection.class.js";
import { Engine } from "./Engine.class.js";
import { P2PRPCRequest } from "../types/P2PRPCRequest.type.js";
import { Node } from "./Node.class.js";
import { Protocol } from "./Protocol.class.js";
import { randomUUID } from "crypto";
import { createDID } from "@olptools/did";
import { DIDType } from "../enum/DIDType.enum.js";

export class P2PRPCHandler {

    private connections: Subject<RPCConnection> = new Subject();
    private listeners: Subscription[] = [];
    private protocol: Protocol;
    private engine: Engine;
    private node?: Node;

    constructor (engine: Engine, protocol: Protocol) {
        this.engine = engine;
        this.protocol = protocol;

        this.setupListeners();
    }

    setupListeners () {
        this.listeners.push(
            this.connections.subscribe(this.onConnection.bind(this))
        ); 
    }

    destroyListeners () {
        this.connections.unsubscribe();
    }

    setNode (node: Node) {
        this.node = node;
    }

    get protocolRoute () {
        return this.protocol.route();
    }

    async onConnection (connection: RPCConnection) {
        connection.requests.subscribe((message: P2PRPCRequest) => {
            this.handleRequest(connection, message);
        });
    }

    async handleRequest (connection: RPCConnection, message: P2PRPCRequest) {
        const messageId = message.id;
        const expectedNetwork = this.engine.network.did;
        const network = message.network;

        if (network !== expectedNetwork) {
            connection.writeError(-32900, "Network mismatch", messageId);
            return;
        }
        try {
            const result = await this.protocol.handleP2PRequest({
                message: message,
                node: this.node,
                did: connection.did
            });
            
            connection.writeResponse(result, messageId);
        } catch (error) {
            if (error.code === "ENOTFOUND") {
                connection.writeError(-32601, "Method not found", messageId);
            }
            
            connection.writeError(error.code ?? -32603, error.message.toString(), messageId);
        }
    }

    async handleSelfRequest ({ path, params }: { path: string[], params: any }) {
        return await this.protocol.handleP2PRequest({
            message: {
                jsonrpc: "2.0",
                method: path.join("/"),
                params,
                id: randomUUID(),
                network: this.engine.network.did
            },
            node: this.node,
            did: this.node.did
        });
    }

    handle (data: IncomingStreamData) {
        const stream = data.stream as YamuxStream;
        const peerId = data.connection.remotePeer.toString();
        const did = createDID(DIDType.Node, peerId);
        const connection = new RPCConnection(this.engine.network.did, stream, did);

        this.connections.next(connection);
    }

}