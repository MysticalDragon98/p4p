# Protocol Node

```javascript
Node.create({
  storagePath: string, // Persistent storage path
  p2p: {
    // Actual addresses where the server will be listening, ex. 0.0.0.0, 8080
		listeningAddresses: {
      host: string,
      port: string
    }[],
    
    // Addresses where the server can be found (Ej. Public Addresses, LAN Addresses, etc)
		advertisingAddresses: {
      host: string,
      port: string
    }[],
    
    // Known peers that are used as entry point for peer discovery
		knownPeers: {
      host: string,
      port: string,
      did: string
    }[],
  },
  
  // Network which the node will connect
  // If a string is passed, it will ask the knownPeers for the network settings
  // If a Network Object is passed, it will take it at it is
  // If a NetworkSettings Object is passed, it will create the network
  network: string | Network | <NetworkSettings>{
    name: string, // Custom name for your network
    salt: string, // Random salt to prevent similar networks to point to the same
    
    // Whitelist / Blacklist of which IP addresses can work on the network
    // Whitelist: "AA.BB.CC.DD/XX", Blacklist: "!AA.BB.CC.DD/XX"
    // Ex. ["0.0.0.0/0", "!127.0.0.1/8"] Allows all networks except localhost
    netmasks: string[]
  },
  
  http: {
    host: string,
    port: string
  },
  
  // List of `Protocol` objects, that extends the functionalities of the node
  // All node custom behavior and logic are defined as protocols.
  protocols: Protocol[]
})
```



