import { HTTPServerOptions } from "../types/HTTPServerOptions.type.js";
import { Application, Request, Response } from "express";
import express from "express";
import { HTTPEndpoints } from "../types/HTTPEndpoints.type.js";
import resolveEndpoint from "../modules/utils/resolveEndpoint.js";
import { Node } from "./Node.class.js";

export class HTTPServer {
    
    public host: string;
    public port: number;
    public endpoints: HTTPEndpoints;
    private node?: Node;
    private server: Application;

    constructor (options: HTTPServerOptions) {
        this.server = express();

        this.port = options.port;
        this.host = options.host;
        this.endpoints = options.endpoints;

        this.setup();
    }

    private setup () {
        this.server.use(async (req: Request, res: Response) => {
            const method = req.method.toUpperCase();
            const path = req.path.split("/").filter(Boolean);
            const fn = resolveEndpoint([ ...path, method ], this.endpoints);
            const params = method === "GET" || method === "DELETE" ? req.query : req.body;
 
            if (!fn) {
                res.status(404).json({
                    method: req.method,
                    route: req.path,
                    error: "Not found"
                });

                return;
            }

            try {
                const result = await fn(params, { node: this.node });

                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({
                    status: "error",
                    code: error.code || "INTERNAL_ERROR",
                    error: error.message || error.toString()
                });

                return;
            }

            res.end();
        });
    }

    public addEndpoints (endpoints: HTTPEndpoints) {
        this.endpoints = { ...this.endpoints, ...endpoints };
    }

    setNode (node: Node) {
        this.node = node;
    }

    start () {
        return new Promise<void>((resolve, reject) => {
            this.server.listen(this.port, this.host, () => {
                resolve();
            });
        })
    }

}