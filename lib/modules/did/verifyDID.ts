import { ok } from "assert";
import { DIDType } from "../../enum/DIDType.enum.js";
import decodeDID from "./decodeDID.js";
import { DID } from "../../types/DID.type.js";

export default function verifyDID (type: DIDType, did: string) {
    decodeDID(type, did);
    return did as DID;
}