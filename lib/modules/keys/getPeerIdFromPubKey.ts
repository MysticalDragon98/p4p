import { publicKeyFromRaw } from "@libp2p/crypto/keys";
import { peerIdFromPublicKey } from "@libp2p/peer-id";

export default function getPeerIdFromPubKey (pubkey: Buffer) {
    return peerIdFromPublicKey(publicKeyFromRaw(pubkey))
}