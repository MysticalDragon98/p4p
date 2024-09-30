export type ProtocolDefinition = {
    name: string,
    version: string,

    p2pEndpoints: Record<string, any>,
    httpEndpoints: Record<string, any>
}