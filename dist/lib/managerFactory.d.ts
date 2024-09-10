import { BaseContract } from "../utils/baseContract";
import { Hex } from "viem";
import { BigNumberish, BytesLike } from "ethers";
export declare class ManagerFactory extends BaseContract {
    constructor(contractAddress: Hex, privateKey?: Hex);
    deployManagerContract(amnt: BigNumberish, salt: BytesLike): Promise<`0x${string}`>;
}
