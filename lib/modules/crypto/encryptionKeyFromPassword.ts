import { pbkdf2Sync } from "crypto";

export default function encryptionKeyFromPassword (password: string) {
    var salt = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    return pbkdf2Sync(password, salt, 100000, 32 + 16, 'sha512').subarray(0, 32);  
}