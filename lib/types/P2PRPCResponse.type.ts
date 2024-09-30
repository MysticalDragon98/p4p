import { DID } from "./DID.type";

export type P2PRPCResponse = {
    jsonrpc: "2.0";
    result?: any;
    id: string;
    error?: {
        code: number;
        message: string;
    };
    
    network: DID;
}