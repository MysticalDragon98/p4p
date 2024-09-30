import { PeerId } from "@libp2p/interface";
import { peerIdFromString } from "@libp2p/peer-id";

export default function getPeerId (peerId: string | PeerId) {
    if (typeof peerId === "string") return peerIdFromString(peerId);
    
    return peerId;
}