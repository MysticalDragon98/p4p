import { Secp256k1PrivateKey, Secp256k1PublicKey } from "@libp2p/interface"
import { PeerId } from "./PeerId.type"

export type NodeKeys = {
    privateKey: Secp256k1PrivateKey,
    publicKey: Secp256k1PublicKey,

    address: string,
    peerId: PeerId
}