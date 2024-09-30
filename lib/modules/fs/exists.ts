import { access } from "fs/promises";

export default async function exists (path: string) {
    try {
        await access(path);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') return false;
        
        throw error;
    }
}