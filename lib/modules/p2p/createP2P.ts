import { FsDatastore } from "datastore-fs"
import { createLibp2p } from "libp2p"
import { yamux } from "@chainsafe/libp2p-yamux"
import { noise } from "@chainsafe/libp2p-noise"
import { tcp } from "@libp2p/tcp"
import { bootstrap } from "@libp2p/bootstrap"
import { identify } from "@libp2p/identify"
import { kadDHT } from "@libp2p/kad-dht"
import { ping } from "@libp2p/ping"
import getSocketAddressTCPMultiAddress from "../utils/getSocketAddressTCPMultiAddress.js"
import { P2PNode } from "../../classes/P2PNode.class.js"
import { P2PNodeOptions } from "../../types/P2PNodeOptions.type.js"
import getKnownPeerMultiAddress from "../utils/getKnownPeerMultiAddress.js"
import { gossipsub } from "@chainsafe/libp2p-gossipsub";

export default async function createP2P (options: P2PNodeOptions) {
    P2PNode.log(`Creating P2P node...`);
    const libp2p = await createLibp2p({
        datastore: new FsDatastore(options.storagePath),
        addresses: {
            listen: options.listeningAddresses.map(getSocketAddressTCPMultiAddress),
            announce: options.advertisingAddresses.map(getSocketAddressTCPMultiAddress)
        },

        transports: [ tcp() ],
        connectionEncrypters: [ noise() ],
        streamMuxers: [ yamux({}) ],
        peerDiscovery: options.knownPeers.length? [
            bootstrap({ list: options.knownPeers.map(getKnownPeerMultiAddress) })
        ] : [],

        services: {
            identify: identify(),
            dht: kadDHT({
                protocol: '/ipfs/kad/1.0.0',
                allowQueryWithZeroPeers: true,
                querySelfInterval: 5000,
                clientMode: false,
                peerInfoMapper: options.peerInfoMapper
            }),
            ping: ping(),
            pubsub: gossipsub()
        },

        connectionManager: {
            
        },
        
        privateKey: options.privateKey
    });

    P2PNode.log(`P2P Node listening on ${libp2p.getMultiaddrs().map(multiaddr => multiaddr.toString()).join(', ')}`);

    return new P2PNode(libp2p);
}