import { DID } from "./DID.type";

export type P2PRPCRequest = {
    jsonrpc: "2.0";
    method: string;
    params: any[];
    id: string;

    network: DID;
}