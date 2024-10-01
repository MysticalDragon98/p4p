import { HTTPEndpoints } from "./HTTPEndpoints.type.js"
import { P2PEndpoints } from "./P2PEndpoints.js"

export type ProtocolDefinition = {
    name: string,
    version: string,

    p2pEndpoints?: P2PEndpoints,
    httpEndpoints?: HTTPEndpoints
}