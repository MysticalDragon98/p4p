import { config } from "dotenv";
import { ok } from "assert";

config();

export const $PRIVKEY_FILE = process.env.PRIVKEY_FILE ?? '.keys/private_key.pem';
export const $LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';
