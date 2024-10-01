import { DIDType } from "../enum/DIDType.enum.js";
import { DID } from "../types/DID.type.js";
import { inspect } from "util";
import { NetworkSettings } from "../types/NetworkSettings.type.js";
import getNetworkFromDID from "../modules/networks/getNetworkFromDID.js";
import createNetwork from "../modules/networks/createNetwork.js";
import { IPFSNode } from "./IPFSNode.class.js";
import netmaskContainsIPv4 from "../modules/network/netmaskContainsIPv4.js";
import { verifyDID } from "@olptools/did";

export class Network {

    public did: DID;
    public settings: NetworkSettings;
    private allowedNetmasks: string[];
    private blockedNetmasks: string[];

    constructor (networkId: string, settings: NetworkSettings) {
        this.did = verifyDID(DIDType.Network, networkId) as DID;
        this.settings = settings;
        this.allowedNetmasks = settings.netmasks.filter(netmask => netmask[0] !== '!');
        this.blockedNetmasks = settings.netmasks
            .filter(netmask => netmask[0] === '!')
            .map(netmask => netmask.substring(1));
    }

    containsIPv4 (ip: string) {
        const whitelisted = this.allowedNetmasks.some(netmask => netmaskContainsIPv4(netmask, ip));
        if (!whitelisted) return false;

        const blacklisted = this.blockedNetmasks.some(netmask => netmaskContainsIPv4(netmask, ip));
        return !blacklisted;
    }

    static async fromDID (ipfs: IPFSNode, did: DID) {
        return await getNetworkFromDID(ipfs, did);
    }

    static async create (ipfs: IPFSNode, settings: NetworkSettings) {
        return await createNetwork(ipfs, settings);
    }

    toString () {
        return this.did;
    }

    [inspect.custom] () {
        return this.toString();
    }

}