import { EngineOptions } from "../../types/EngineOptions.type.js";
import { KeyStorage } from "../../classes/KeyStorage.class.js";
import { P2PNode } from "../../classes/P2PNode.class.js";
import { IPFSNode } from "../../classes/IPFSNode.class.js";
import { HTTPServer } from "../../classes/HTTPServer.class.js";
import { Engine } from "../../classes/Engine.class.js";
import { Web3 } from "../../classes/Web3.class.js";
import ensureEngineFolderStructure from "./ensureEngineFolderStructure.js";
import getNetwork from "../networks/getNetwork.js";

export default async function createEngine (options: EngineOptions) {
    const paths = await ensureEngineFolderStructure(options.storagePath);
    const keyStorage = await KeyStorage.fromPemFile(paths.privateKey, { ensure: true });

    const p2pNode = await P2PNode.create({
        privateKey: keyStorage.privkey(),
        storagePath: paths.p2p,
        listeningAddresses: options.p2p.listeningAddresses,
        advertisingAddresses: options.p2p.advertisingAddresses,
        knownPeers: options.p2p.knownPeers,
        peerInfoMapper: function (peerInfo) {
            return p2pNode.peerInfoMapper(peerInfo);
        }
    });

    const ipfsNode = await IPFSNode.create({
        storagePath: paths.ipfs,
        p2p: p2pNode
    });

    const network = await getNetwork(ipfsNode, options.network);
    p2pNode.setNetworkAddressMapper(network);

    const httpServer = new HTTPServer({
        port: options.http.port,
        host: options.http.host
    });

    const web3 = options.web3 && new Web3(keyStorage, options.web3);

    const engine = new Engine(
        keyStorage,
        p2pNode,
        ipfsNode,
        network,
        httpServer,
        web3
    );

    engine.addProtocols(options.protocols);

    await httpServer.start();

    return engine;
}