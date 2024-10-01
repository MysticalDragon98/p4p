import { mkdir } from "fs/promises";
import { EngineOptions } from "../../types/EngineOptions.type.js";
import { join } from "path";
import { KeyStorage } from "../../classes/KeyStorage.class.js";
import { P2PNode } from "../../classes/P2PNode.class.js";
import { IPFSNode } from "../../classes/IPFSNode.class.js";
import { Network } from "../../classes/Network.class.js";
import { NetworkSettings } from "../../types/NetworkSettings.type.js";
import { HTTPServer } from "../../classes/HTTPServer.class.js";
import { Engine } from "../../classes/Engine.class.js";
import { DID } from "../../types/DID.type.js";
import peerInfoWithoutNetworkPrivateAddresses from "../network/peerInfoWithoutNetworkPrivateAddresses.js";
import { PeerInfo } from "@libp2p/interface";

export default async function createEngine (options: EngineOptions) {
    const keysFolder = join(options.storagePath, "keys");
    const p2pFolder = join(options.storagePath, "p2p");
    const ipfsFolder = join(options.storagePath, "ipfs");
    const keyFile = join(keysFolder, "privkey.pem");

    await mkdir(p2pFolder, { recursive: true });
    await mkdir(ipfsFolder, { recursive: true });
    await mkdir(keysFolder, { recursive: true });

    const keyStorage = await KeyStorage.fromPemFile(keyFile, { ensure: true });

    const p2pNode = await P2PNode.create({
        privateKey: keyStorage.privkey(),
        storagePath: p2pFolder,
        listeningAddresses: options.p2p.listeningAddresses,
        advertisingAddresses: options.p2p.advertisingAddresses,
        knownPeers: options.p2p.knownPeers,
        peerInfoMapper: function (peerInfo) {
            return p2pNode.peerInfoMapper(peerInfo);
        } 
    });

    const ipfsNode = await IPFSNode.create({
        storagePath: ipfsFolder,
        p2p: p2pNode
    });

    const network = options.network instanceof Network ? options.network :
                    typeof options.network === "string" ? await Network.fromDID(ipfsNode, options.network as DID) :
                    await Network.create(ipfsNode, options.network as NetworkSettings);

    p2pNode.updatePeerInfoMapper((peerInfo: PeerInfo) => {
        return peerInfoWithoutNetworkPrivateAddresses(network, peerInfo);
    });
    
    let httpEndpoints = { ...options.http.endpoints };

    const httpServer = new HTTPServer({
        port: options.http.port,
        host: options.http.host,
        endpoints: httpEndpoints
    });

    const instance = new Engine(
        keyStorage,
        p2pNode,
        ipfsNode,
        network,
        httpServer
    );

    for (const protocol of options.protocols) {
        instance.addProtocol(protocol);
    }

    await httpServer.start();

    return instance;
}