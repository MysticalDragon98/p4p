import { DIDType } from "../../enum/DIDType.enum.js";
import { NetworkSettings } from "../../types/NetworkSettings.type.js";
import { Network } from "../../classes/Network.class.js";
import { randomUUID } from "crypto";
import { IPFSNode } from "../../classes/IPFSNode.class.js";
import { createDID } from "@olptools/did";

export default async function createNetwork (ipfs: IPFSNode, settings: NetworkSettings & { salt?: string }) {
    settings.salt ??= randomUUID();

    const cid = await ipfs.saveJSON(settings);
    const networkId = createDID(DIDType.Network, cid.toString());
    
    return new Network(networkId, settings);
}