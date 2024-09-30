import { DIDType } from "../../enum/DIDType.enum.js";
import { DID } from "../../types/DID.type.js";

export default function createDID (type: DIDType, content: string, url?: string) {
    let base = `${type}(${content})`;

    if (url) {
        base = `${base}/${url}`;
    }

    return base as DID;
}