import { IPFSNode } from "../../classes/IPFSNode.class.js";
import { Network } from "../../classes/Network.class.js";
import { DID } from "../../types/DID.type.js";
import { NetworkSettings } from "../../types/NetworkSettings.type.js";

export default async function getNetwork (ipfsNode: IPFSNode, network: string | Network | NetworkSettings) {
    return network instanceof Network ? network :
        typeof network === "string" ? await Network.fromDID(ipfsNode, network as DID) :
        await Network.create(ipfsNode, network as NetworkSettings);
}