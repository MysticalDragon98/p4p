import { FsBlockstore } from "blockstore-fs";
import { Helia, createHelia } from "helia";
import { P2PNode } from "./P2PNode.class";
import * as HeliaJSON from "@helia/json";
import { json } from "@helia/json"
import { CID } from "../types/CID.type.js";
import getCID from "../modules/cid/getCID.js";
import { IPFSGetJSONOptions } from "../types/IPFSGetJSONOptions.type";
import debug from "debug";

export interface IPFSNodeOptions {
    storagePath: string,
    p2p: P2PNode
}

export class IPFSNode {

    private ipfs: Helia;
    private json: HeliaJSON.JSON;
    public static log = debug('p4p-ipfs');

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
            datastore: (<any>p2p).datastore,
            // blockBrokers: []
        });

        await helia.start();

        return new IPFSNode(helia);
    }

    async saveJSON<T> (data: T) {
        IPFSNode.log(`Saving JSON into IPFS local storage...`);
        const cid = await this.json.add(data);
        IPFSNode.log(`JSON saved into IPFS local storage with CID: ${cid.toString()}`);
        
        return cid;
    }

    async getJSON<T> (cid: CID | string, options?: IPFSGetJSONOptions) {
        IPFSNode.log(`Getting JSON from IPFS with CID: ${cid}...`);
        const maxRetries = options?.maxRetries ?? 10;
        const timeout = options?.timeout ?? 1000;
        const pin = options?.pin ?? false;
        let json: T;

        try {
            const _cid = getCID(cid);
            json = await new Promise<T>((resolve, reject) => {
                this.json.get(_cid)
                    .then(resolve)
                    .catch(reject);

                setTimeout(() => {
                    reject(new Error("Timeout"));
                }, timeout);
            });

            IPFSNode.log(`JSON retrieved from IPFS with CID: ${cid.toString()}`);
        } catch (error) {
            IPFSNode.log(`Failed to get JSON from IPFS with CID: ${cid}: ${error.message}, ${error.stack}`);
            if (maxRetries === 0) throw error;
            
            return this.getJSON(cid, { pin, maxRetries: maxRetries - 1, timeout });
        }

        if (pin) this.saveJSON(json);

        return json;
    }

}