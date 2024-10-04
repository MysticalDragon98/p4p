import { mkdir } from "fs/promises";
import { join } from "path";

export default async function ensureEngineFolderStructure (path: string) {
    const keysFolder = join(path, "keys");
    const p2pFolder = join(path, "p2p");
    const ipfsFolder = join(path, "ipfs");
    const keyFile = join(keysFolder, "privkey.pem");

    await mkdir(p2pFolder, { recursive: true });
    await mkdir(ipfsFolder, { recursive: true });
    await mkdir(keysFolder, { recursive: true });

    return {
        keys: keysFolder,
        p2p: p2pFolder,
        ipfs: ipfsFolder,
        privateKey: keyFile
    };
}