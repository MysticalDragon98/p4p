import { Interface, InterfaceAbi } from "ethers";

export type Web3ContractDescriptor = {
    address: string;
    abi: Interface | InterfaceAbi;
}