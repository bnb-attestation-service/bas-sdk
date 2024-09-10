import { BaseContract } from "../utils/baseContract";
import { Hex } from "viem";
import { BytesLike } from "ethers";
export declare class ManagerFactory extends BaseContract {
    private crosschain;
    constructor(contractAddress: Hex, privateKey?: Hex);
    private deployManagerContract;
    getManagerAddress(salt: BytesLike): Promise<unknown>;
    deployBucketManager(saltStr: string): Promise<unknown>;
}
