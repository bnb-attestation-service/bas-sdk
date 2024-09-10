import { BaseContract } from "../utils/baseContract";
import { Hex } from "viem";
export declare class CrossChain extends BaseContract {
    constructor(contractAddress: Hex, privateKey?: Hex);
    getRelayFees(): Promise<unknown>;
}
