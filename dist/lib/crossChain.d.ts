import { BaseContract } from "../utils/baseContract";
import { Hex } from "viem";
export declare class CrossChain extends BaseContract {
    constructor(privateKey?: Hex);
    getRelayFees(): Promise<any>;
}
