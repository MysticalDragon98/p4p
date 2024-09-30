import { FsBlockstore } from "blockstore-fs";
import { Helia, createHelia } from "helia";
import { P2PNode } from "./P2PNode.class";
import * as HeliaJSON from "@helia/json";
import { json } from "@helia/json"
import { CID } from "../types/CID.type.js";
import getCID from "../modules/cid/getCID.js";

export interface IPFSNodeOptions {
    storagePath: string,
    p2p: P2PNode
}

export class IPFSNode {

    private ipfs: Helia;
    private json: HeliaJSON.JSON;

    private constructor (ipfs: Helia) {
        this.ipfs = ipfs;
        this.json = json(ipfs);
    }

    static async create (options: IPFSNodeOptions) {
        const p2p = options.p2p.nativeP2P();
        const blockstore = new FsBlockstore(options.storagePath);
        const helia = await createHelia({
            blockstore,
            libp2p: <any>p2p,
            datastore: (<any>p2p).datastore
        });

        await helia.start();

        return new IPFSNode(helia);
    }

    async saveJSON<T> (data: T) {
        const cid = await this.json.add(data);
        
        return cid;
    }

    async getJSON<T> (cid: CID | string, { pin } : { pin: boolean } = { pin: false }) {
        const _cid = getCID(cid); 
        const json = await this.json.get(_cid) as T;

        if (pin) this.saveJSON(json);

        return json;
    }

}