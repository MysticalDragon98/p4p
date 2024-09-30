import { IPFSNode } from "../../classes/IPFSNode.class.js";
import { Network } from "../../classes/Network.class.js";
import { DIDType } from "../../enum/DIDType.enum.js";
import { DID } from "../../types/DID.type.js";
import { NetworkSettings } from "../../types/NetworkSettings.type";
import getCID from "../cid/getCID.js";
import decodeDID from "../did/decodeDID.js";

export default async function getNetworkFromDID (ipfs: IPFSNode,  did: DID) {
    const { content } = decodeDID(DIDType.Network, did);
    const cid = getCID(content);
    const settings = await ipfs.getJSON<NetworkSettings>(cid, { pin: true });
    const network = new Network(did, settings);

    return network;
}