import { HTTPServerOptions } from "../types/HTTPServerOptions.type.js";
import { Server } from "@olptools/http-server";

export class HTTPServer {

    public server: Server

    constructor (options: HTTPServerOptions) {
        this.server = new Server({
            port: options.port,
            endpoints: options.endpoints ?? {}
        });
    }

    start () {
        return this.server.listen();
    }

}