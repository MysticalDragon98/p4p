import { HTTPEndpoints } from "./HTTPEndpoints.type.js"

export type HTTPServerOptions = {
    host: string,
    port: number,
    endpoints?: HTTPEndpoints
}