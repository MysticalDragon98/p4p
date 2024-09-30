import { createPrivateKey } from "crypto";
import base64URLToBuffer from "../utils/base64URLToBuffer.js";
import { publicToAddress } from "ethereumjs-util";
import { peerIdFromPrivateKey, peerIdFromPublicKey } from "@libp2p/peer-id";
import { privateKeyFromRaw } from "@libp2p/crypto/keys";
import { Secp256k1PeerId, Secp256k1PrivateKey, Secp256k1PublicKey } from "@libp2p/interface";
import secp256k1 from "secp256k1";

export default async function deriveKeysFromPEM (pem: string) {
    const sec1Key = createPrivateKey({
        key: pem,
        format: 'pem',
        type: 'sec1'
    });

    const buffer = base64URLToBuffer(sec1Key.export({ format: 'jwk' }).d);
    const privateKey: Secp256k1PrivateKey = privateKeyFromRaw(buffer) as Secp256k1PrivateKey; 
    const publicKey: Secp256k1PublicKey = privateKey.publicKey;
    const uncompressedKey = Buffer.from(secp256k1.publicKeyConvert(publicKey.raw, false)); 
    const address = publicToAddress(uncompressedKey.subarray(1));

    return {
        privateKey,
        publicKey,
        address: '0x' + address.toString('hex'),
        peerId: peerIdFromPublicKey(publicKey)
    }
}