import { Endpoint } from "./Endpoint.type.js"

export type P2PEndpoints = {
    [key: string]: P2PEndpoints | Endpoint
}