import { Node } from "../classes/Node.class";
import { Protocol } from "../classes/Protocol.class";

export type Endpoint = (args: any, context: { node: Node, protocol: Protocol }) => any;