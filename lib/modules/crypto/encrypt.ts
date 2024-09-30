import { createCipheriv, randomBytes } from "crypto";
import encryptionKeyFromPassword from "./encryptionKeyFromPassword";

export default async function encrypt (buf: Buffer, password: string) {
    const key = encryptionKeyFromPassword(password);
    const iv = randomBytes(16);

    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([iv, cipher.update(buf), cipher.final()]);

    return encrypted;
}

