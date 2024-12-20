import { HTTPServerOptions } from "../types/HTTPServerOptions.type.js";
import { Application, Request, Response } from "express";
import express from "express";
import { Node } from "./Node.class.js";
import { Protocol } from "./Protocol.class.js";
import { HTTPMethod } from "../enum/HTTPMethod.enum.js";
import debug from "debug";

export class HTTPServer {
    
    public host: string;
    public port: number;
    public protocols: Record<string, Protocol> = {};
    private node?: Node;
    private server: Application;
    public static log = debug("p4p-http");

    constructor (options: HTTPServerOptions) {
        this.server = express();

        this.port = options.port;
        this.host = options.host;

        this.setup();
    }

    private setup () {
        this.server.use(express.json());
        this.server.use(async (req: Request, res: Response) => {
            const method = req.method.toUpperCase() as HTTPMethod;
            const params = method === "GET" || method === "DELETE" ? req.query : req.body;
            const path = req.path.split("/").filter(Boolean);
            const protocol = this.getProtocol(`/${path[0]}/${path[1]}`);

            HTTPServer.log(`Handling HTTP request for ${req.method} ${req.path}`);
            
            if (!protocol) {
                res.status(404).json({
                    method: req.method,
                    route: req.path,
                    error: "Not found"
                });
                
                return;
            }

            try {
                const result = await protocol.handleHTTPRequest({
                    path: path.slice(2),
                    method,
                    params,
                    node: this.node,
                    did: this.node.did
                });

                res.status(200).json(result ?? {});
            } catch (error: any) {
                if (error.code === "ENOTFOUND") {
                    res.status(404).json({
                        method: req.method,
                        route: req.path,
                        error: "Not found"
                    });
                    
                    return;
                }

                res.status(500).json({
                    status: "error", 
                    code: error.code ?? "INTERNAL_ERROR",
                    error: error.message ?? error.toString()
                });
            }
        });
    }

    getProtocol (route: string) {
        return this.protocols[route];
    }

    public addProtocol (protocol: Protocol) {
        this.protocols[protocol.route()] = protocol;
    }

    setNode (node: Node) {
        this.node = node;
    }

    start () {
        return new Promise<void>((resolve, reject) => {
            this.server.listen(this.port, this.host, () => {
                HTTPServer.log(`HTTP server listening on ${this.host}:${this.port}`);
                resolve();
            });
        })
    }

}