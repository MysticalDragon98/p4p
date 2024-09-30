import { PeerInfo, Secp256k1PrivateKey } from "@libp2p/interface";
import { KnownPeerAddress } from "./KnownPeerAddress.type.js";
import { SocketAddress } from "./SocketAddress.type.js";

export type P2PNodeOptions = {
    privateKey: Secp256k1PrivateKey;
    storagePath: string,

    listeningAddresses: SocketAddress[],
    advertisingAddresses: SocketAddress[],
    knownPeers: KnownPeerAddress[],
    peerInfoMapper: (peerInfo: PeerInfo) => PeerInfo
}
