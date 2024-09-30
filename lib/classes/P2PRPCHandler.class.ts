import { Subject, Subscription } from "rxjs";
import { IncomingStreamData } from "@libp2p/interface";
import { YamuxStream } from "@chainsafe/libp2p-yamux/src/stream";
import { RPCConnection } from "./RPCConnection.class.js";
import { Engine } from "./Engine.class.js";
import { P2PRPCRequest } from "../types/P2PRPCRequest.type.js";

export class P2PRPCHandler {

    private connections: Subject<RPCConnection> = new Subject();
    private listeners: Subscription[] = [];
    private endpoints: Record<string, any> = {};
    private engine: Engine;

    constructor (engine: Engine, endpoints: Record<string, any> = {}) {
        this.engine = engine;
        this.endpoints = endpoints;

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

        let fn = this.resolveEndpoint(message.method);

        if (fn === null) {
            connection.writeError(-32601, "Method not found", messageId);
            return;
        }

        try {
            const result = await fn(...message.params);
            
            connection.writeResponse(result, messageId);
        } catch (error) {
            connection.writeError(-32603, error.message.toString(), messageId);
        }
    }

    resolveEndpoint (method: string) {
        const path = method.split("/");
        let fn: object | Function = this.endpoints;

        for (const segment of path) {
            fn = fn?.[segment];
        }

        if (typeof fn !== "function") {
            return null;
        }

        return fn;
    }

    handle (data: IncomingStreamData) {
        const stream = data.stream as YamuxStream;
        const connection = new RPCConnection(this.engine.network.did, stream);

        this.connections.next(connection);
    }

}