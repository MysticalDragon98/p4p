import { DID } from "./DID.type"

export type KnownPeerAddress = {
    host: string,
    port: number,
    did: DID
}