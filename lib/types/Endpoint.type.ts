import { Node } from "../classes/Node.class";

export type Endpoint = (args: any, context: { node: Node }) => any;