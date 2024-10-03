import { DIDType } from "../../enum/DIDType.enum.js";
import { decodeDID } from "@olptools/did";
import getPeerIdFromPubKey from "../keys/getPeerIdFromPubKey.js";

export default function getPeerIdFromNode (nodeDID: string) {
    const did = decodeDID(DIDType.Node, nodeDID);

    return getPeerIdFromPubKey(Buffer.from(did.content, "base64"));
}