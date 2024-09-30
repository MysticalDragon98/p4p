import { YamuxStream } from "@chainsafe/libp2p-yamux/dist/src/stream";
import { Connection } from "./Connection.class.js";
import { Subject, Subscription, filter } from "rxjs";
import { P2PRPCRequest } from "../types/P2PRPCRequest.type.js";
import { RPCConnectionMessageType } from "../enum/RPCConnectionMessageType.enum.js";
import { P2PRPCResponse } from "../types/P2PRPCResponse.type.js";
import { randomUUID } from "crypto";

export class RPCConnection {

    connection: Connection;

    requests: Subject<P2PRPCRequest> = new Subject();
    responses: Subject<P2PRPCResponse> = new Subject();

    networkId: string;

    private listeners: Subscription[] = [];

    constructor (networkId: string, stream: YamuxStream) {
        this.connection = new Connection(stream);
        this.networkId = networkId;
        
        this.setupListeners();
    }

    setupListeners () {
        this.listeners.push(
            this.connection.messages.subscribe(this.onMessage.bind(this)),
            this.connection.closed.subscribe(this.onClose.bind(this))
        );
    }

    destroyListeners () {
        this.listeners.forEach(listener => listener.unsubscribe());
        this.requests.unsubscribe();
        this.responses.unsubscribe();
    }

    async onMessage (data: Buffer) {
        const message = this.parseMessage(data);
        
        if (message.type === RPCConnectionMessageType.Invalid) return;
        if (message.type === RPCConnectionMessageType.Request) this.requests.next(message.json);
        if (message.type === RPCConnectionMessageType.Response) this.responses.next(message.json);
    }

    parseMessage (data: Buffer):
        { type: RPCConnectionMessageType.Request, json: P2PRPCRequest } |
        { type: RPCConnectionMessageType.Response, json: P2PRPCResponse } |
        { type: RPCConnectionMessageType.Invalid, json: null } {
        const json = this.parseIncomingJSON(data);

        if (json === null) return { type: RPCConnectionMessageType.Invalid, json: null }

        if (json.jsonrpc !== "2.0") {
            this.writeError(-32600, "Invalid Request");

            return { type: RPCConnectionMessageType.Invalid, json: null }
        }
        
        const messageType = ((json as P2PRPCRequest).method) ? RPCConnectionMessageType.Request : RPCConnectionMessageType.Response;

        return { type: messageType, json: json }
    }

    parseIncomingJSON (data: Buffer) {
        try {
            return JSON.parse(data.toString());
        } catch (error) {
            this.writeError(-32700, "Parse error");
            
            return null;
        }
    }

    async onClose () {
        this.destroyListeners();
    }

    async request (method: string, params: any[], options: { timeout?: number } = {}) {
        const id = randomUUID();
        await this.write({
            jsonrpc: "2.0",
            method,
            params,
            id,
            network: this.networkId
        });

        return await this.waitForResponse(id, options.timeout);
    }

    waitForResponse (id: string, timeout: number = 10000) {
        return new Promise((resolve, reject) => {
            const subscription = this.responses.pipe(
                filter(response => response.id === id)
            ).subscribe(message => {
                if (message.error) return reject(new Error(message.error.message));

                resolve(message.result);
            });

            setTimeout(() => {
                subscription.unsubscribe();
                reject(new Error("Request timed out."));
            }, timeout);
        })
    }

    async write (data: any) {
        const buffer = Buffer.from(JSON.stringify(data));

        return await this.connection.write(buffer);
    }

    async writeResponse (result: any, id: string | null = null) {
        return this.write(<P2PRPCResponse>{
            jsonrpc: "2.0",
            id,
            result
        })
    }

    async writeError (code: number, message: string, id: string | null = null) {
        return this.write({
            jsonrpc: "2.0",
            id,
            error: {
                code,
                message
            }
        })
    }
    async end (data?: any) {
        const buffer = Buffer.from(JSON.stringify(data));

        return await this.connection.end(buffer);
    }
}