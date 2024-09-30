import { createDecipheriv } from "crypto";
import encryptionKeyFromPassword from "./encryptionKeyFromPassword";

export default async function decrypt (encrypted: Buffer, password: string) {
    const iv = encrypted.subarray(0, 16);
    const encryptedBuf = encrypted.subarray(16);
    const key = encryptionKeyFromPassword(password);

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedBuf), decipher.final()]);

    return decrypted;
}