import { ok } from "assert";
import { DIDContent } from "../../types/DIDContent.type.js";
import { DIDType } from "../../enum/DIDType.enum.js";

export default function decodeDID (didType: DIDType, did: string): DIDContent {
    const [ type, content ] = /^(.*)\((.*)\)$/.exec(did)?.slice(1) ?? [];
    
    ok(type === didType, `Invalid DID type. Expected ${didType}, got ${type}.`);

    return {
        type: type as DIDType,
        content: content
    };
}