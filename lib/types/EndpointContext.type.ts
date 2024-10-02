import { Node } from "../classes/Node.class.js"
import { Protocol } from "../classes/Protocol.class.js"

export type EndpointContext<T extends Protocol> = {
    node: Node,
    protocol: T,
    did: string
}