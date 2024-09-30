import { publicKeyFromRaw } from "@libp2p/crypto/keys";
import { DIDType } from "../../enum/DIDType.enum.js";
import { KnownPeerAddress } from "../../types/KnownPeerAddress.type.js";
import decodeDID from "../did/decodeDID.js";
import getPeerIdFromPubKey from "../keys/getPeerIdFromPubKey.js";
import secp256k1 from "secp256k1";
import { Secp256k1PublicKey } from "@libp2p/interface";

export default function getKnownPeerMultiAddress (address: KnownPeerAddress): string {
    const nodeId = decodeDID(DIDType.Node, address.did).content;
    
    const compressedPubKey = Buffer.from(nodeId, "base64");
    const pubkey = publicKeyFromRaw(compressedPubKey) as Secp256k1PublicKey;
    const peerId = getPeerIdFromPubKey(Buffer.from(pubkey.raw));
    
    return `/ip4/${address.host}/tcp/${address.port}/p2p/${peerId.toString()}`;
}