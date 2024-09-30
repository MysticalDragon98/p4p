import { Netmask } from "netmask";

export default function netmaskContainsIPv4 (netmask: string, ip: string) {
    return new Netmask(netmask).contains(ip);
}