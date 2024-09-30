import { generateKeyPairSync } from "crypto";
import { writeFile } from "fs/promises";

export default async function generateKeyfile (destinationPath: string) {
    const { privateKey } = generateKeyPairSync(<any>'ec', {
        namedCurve: 'secp256k1',
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    await writeFile(destinationPath, privateKey.toString());
}