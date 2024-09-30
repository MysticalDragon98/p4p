import { SocketAddress } from "../../types/SocketAddress.type.js";

export default function getSocketAddressTCPMultiAddress (address: SocketAddress): string {
    return `/ip4/${address.host}/tcp/${address.port}`;
}