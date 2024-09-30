import { PeerInfo } from "@libp2p/interface";
import { Network } from "../../classes/Network.class";
import { MultiAddrType } from "../../enum/MultiAddrType.enum.js";

export default function peerInfoWithoutNetworkPrivateAddresses (network: Network, peerInfo: PeerInfo) {
    const multiaddrs = [];

    for (const multiaddr of peerInfo.multiaddrs) {
        const [ type, ip ] = multiaddr.stringTuples()[0] as [MultiAddrType, string];
        
        if (type === MultiAddrType.IPv4 && network.containsIPv4(ip)) {
            multiaddrs.push(multiaddr);
        }
    }
    
    return {
        ...peerInfo,
        multiaddrs: multiaddrs
    }
}