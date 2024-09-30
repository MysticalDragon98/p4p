import { Libp2p } from "libp2p"
import { P2PNodeOptions } from "../types/P2PNodeOptions.type.js"
import createP2P from "../modules/p2p/createP2P.js"
import { Identify } from "@libp2p/identify";
import { KadDHT, removePrivateAddressesMapper } from "@libp2p/kad-dht";
import { Peer, PeerInfo, PubSub } from "@libp2p/interface";
import { GossipsubEvents } from "@chainsafe/libp2p-gossipsub";
import { PingService } from "@libp2p/ping";

export class P2PNode {

    libp2p: Libp2p<{
        identify: Identify,
        dht: KadDHT,
        pubsub: PubSub<GossipsubEvents>,
        ping: PingService
    }>;

    _peerInfoMapper?: (peerInfo: PeerInfo) => PeerInfo;

    constructor (libp2p: Libp2p<{identify: Identify, dht: KadDHT, pubsub: PubSub<GossipsubEvents>, ping: PingService }>) { 
        this.libp2p = libp2p;
    }

    static async create (options: P2PNodeOptions) {
        return await createP2P(options);
    }

    updatePeerInfoMapper (peerInfoMapper: (peerInfo: PeerInfo) => PeerInfo) {
        this._peerInfoMapper = peerInfoMapper;
    }

    peerInfoMapper (peerInfo: PeerInfo) {
        if (this._peerInfoMapper) {
            return this._peerInfoMapper(peerInfo);
        }

        return removePrivateAddressesMapper(peerInfo);
    }

    addresses () {
        return this.libp2p.getMultiaddrs();
    }

    nativeP2P () {
        return this.libp2p;
    }

    peers() {
        return this.libp2p.getPeers();
    }

}