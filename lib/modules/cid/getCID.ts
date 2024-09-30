import { CID } from "multiformats";

export default function getCID (cid: string | CID) {
    if (typeof cid === "string") return CID.parse(cid);
    
    return cid;
}