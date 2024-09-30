import { Node } from "./lib/classes/Node.class.js";
import { Protocol } from "./lib/classes/Protocol.class.js";

async function main () {
    const node = await Node.create({
        storagePath:'.data/node1',

        p2p: {
            advertisingAddresses: [{ host: '127.0.0.1', port: 8080 }],
            listeningAddresses: [{ host: '127.0.0.1', port: 8080 }],
            knownPeers: [],
        },

        network: "Network(bagaaiera5kipnpk7qqgz7isps7y6krjwz4hcbg5rhb24micrn2b6prq5xchq)",

        http: {
            host: '0.0.0.0',
            port: 8081
        },

        protocols: [
            new Protocol({
                name: "sample",
                version: "1.0.0",

                p2pEndpoints: {
                    ping: {
                        pong: async (name: string) => {
                            return "Hola: " + name;
                        }
                    }
                },

                httpEndpoints: {
                    ping: () => "pong",
                    carla: () => "Camilo"
                }
            })
        ]
    });

    const node2 = await Node.create({
        storagePath:'.data/node2',

        p2p: {
            advertisingAddresses: [{ host: '127.0.0.1', port: 8082 }],
            listeningAddresses: [{ host: '127.0.0.1', port: 8082 }],
            knownPeers: [{
                host: '127.0.0.1',
                port: 8080,
                did: node.did
            }]
        },

        network: "Network(bagaaiera5kipnpk7qqgz7isps7y6krjwz4hcbg5rhb24micrn2b6prq5xchq)",

        http: {
            host: '0.0.0.0',
            port: 8083
        },

        protocols: []
    });

    
    
}

main().catch(error => {
    console.error(error);
    process.exit(1);
})

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);