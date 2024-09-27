import { readFile } from "fs/promises";
import Logger from "../const/Logger.const";
import { createPrivateKey } from "crypto";
import base64URLToBuffer from "../modules/utils/base64URLToBuffer";
import { publicToAddress } from "ethereumjs-util";

export class KeyStorage {

    private static _keys: { privateKey: Buffer, publicKey: Buffer, address: string } = null;

    static async loadFromFile (filePath: string) {
        Logger.info('Loading keys from keyfile...');

        const pem = await KeyStorage._readKeyFile(filePath);
        const keyPair = await KeyStorage.deriveKeysFromPEM(pem);

        this._keys = keyPair;

        Logger.info('Successfully retrieved keys from keyfile.');
        Logger.info(`Public key: ${keyPair.publicKey.toString('hex')}`);
        Logger.info(`Ethereum address: ${keyPair.address}`);
    }

    private static async _readKeyFile (pemFile: string) {
        try {
            return await readFile(pemFile, 'utf8');
        } catch (error) {
            Logger.error(`Could not load keyfile ${pemFile}: ` + error.message);
            
            if (error.code === 'ENOENT') {
                Logger.error(`💡 Try running 'npm run keygen' to generate a new key.`);
            }

            throw error;
        }
    }

    private static async deriveKeysFromPEM (pem: string) {
        const privateKey = createPrivateKey({
            key: pem,
            format: 'pem',
            type: 'sec1'
        }).export({ format: 'jwk' });

        const buffer = base64URLToBuffer(privateKey.d);
        const xBuffer = base64URLToBuffer(privateKey.x);
        const yBuffer = base64URLToBuffer(privateKey.y);

        const publicKey = Buffer.concat([ xBuffer, yBuffer ]);
        const address = publicToAddress(publicKey);

        return {
            privateKey: buffer,
            publicKey: publicKey,
            address: '0x' + address.toString('hex')
        }
    }
}