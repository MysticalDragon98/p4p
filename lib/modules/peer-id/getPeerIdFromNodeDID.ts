import { DIDType } from "../../enum/DIDType.enum.js";
import decodeDID from "../did/decodeDID.js";
import getPeerIdFromPubKey from "../keys/getPeerIdFromPubKey.js";

export default function getPeerIdFromNodeDID (nodeDID: string) {
    const did = decodeDID(DIDType.Node, nodeDID);

    return getPeerIdFromPubKey(Buffer.from(did.content, "base64"));
}