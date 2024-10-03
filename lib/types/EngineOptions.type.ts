import { Network } from "../classes/Network.class.js";
import { Protocol } from "../classes/Protocol.class.js";
import { HTTPServerOptions } from "./HTTPServerOptions.type.js";
import { NetworkSettings } from "./NetworkSettings.type.js";
import { P2PNodeOptions } from "./P2PNodeOptions.type.js";
import { Web3Options } from "./Web3Options.type.js";

export type EngineOptions = {
    storagePath: string,
    p2p: Omit<Omit<Omit<P2PNodeOptions, "privateKey">, "storagePath">, "peerInfoMapper">,
    http: HTTPServerOptions,
    web3?: Web3Options,

    network: string | Network | NetworkSettings;
    protocols: Protocol[]
}