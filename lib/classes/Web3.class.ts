import { JsonRpcProvider, SigningKey, Wallet, Contract, Interface, InterfaceAbi } from "ethers";
import { Web3Options } from "../types/Web3Options.type";
import { KeyStorage } from "./KeyStorage.class";

export class Web3 {

    private wallet: Wallet;
    private provider: JsonRpcProvider;

    constructor (keyStorage: KeyStorage, options: Web3Options) {
        const signingKey = new SigningKey(keyStorage.privkey().raw);
        const provider = new JsonRpcProvider(options.provider);
        
        this.provider = provider;
        this.wallet = new Wallet(signingKey, this.provider);
    }

    contract (address: string, abi: Interface | InterfaceAbi) {
        const contract = new Contract(address, abi, this.wallet);

        return contract;
    }

}