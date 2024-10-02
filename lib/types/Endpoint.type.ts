import { Protocol } from "../classes/Protocol.class.js";
import { EndpointContext } from "./EndpointContext.type.js";

export type Endpoint<T extends Protocol> = (args: any, context: EndpointContext<T>) => any;