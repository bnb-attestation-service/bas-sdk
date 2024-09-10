import { BaseContract } from "../utils/baseContract";
import { Hex } from "viem";
import { BigNumberish, BytesLike } from "ethers";
export declare class BucketManager extends BaseContract {
    constructor(contractAddress: Hex, privateKey?: Hex);
    createUserBucket(executorData: BytesLike): Promise<`0x${string}`>;
    createSchemaBucket(name: string, schemaId: Hex, executorData: BytesLike): Promise<`0x${string}`>;
    createUserPolicy(data: BytesLike): Promise<`0x${string}`>;
    createSchemaPolicy(name: string, schemaId: Hex, createPolicyData: BytesLike): Promise<`0x${string}`>;
    transferOwnership(address: Hex): Promise<`0x${string}`>;
    topUpBNB(amount: BigNumberish): Promise<`0x${string}`>;
    executeGreenfieldCommand(msgTypes: number[], msgData: BytesLike[]): Promise<`0x${string}`>;
    getCreatedBuckets(index: BigNumberish): Promise<unknown>;
    hasExistedBucket(): Promise<unknown>;
}
