import { readFile } from "fs/promises";
import deriveKeysFromPEM from "../modules/crypto/deriveNodeKeysFromPEM.js";
import { NodeKeys } from "../types/NodeKeys.type.js";
import exists from "../modules/fs/exists.js";
import generateKeyfile from "../modules/crypto/generateKeyfile.js";

export class KeyStorage {

    private _keys: NodeKeys = null;

    private constructor (keys: NodeKeys) {
        this._keys = keys;
    }

    static async fromPemFile (filePath: string, { ensure }: { ensure: boolean } = { ensure: false }) {
        if (ensure && !await exists(filePath)) {
            await generateKeyfile(filePath);
        }

        const pem = await readFile(filePath, 'utf8');
        const keyPair = await deriveKeysFromPEM(pem);

        return new KeyStorage(keyPair);
    }

    public pubkey () { return this._keys.publicKey; }
    public privkey () { return this._keys.privateKey; }
    public address () { return this._keys.address; }
    public peerId () { return this._keys.peerId; }

}