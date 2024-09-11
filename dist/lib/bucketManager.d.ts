import { Hex } from "viem";
import { BigNumberish, BytesLike } from "ethers";
import { BaseContract } from "../utils/baseContract";
export declare class BucketManager extends BaseContract {
    private crosschain;
    constructor(contractAddress: Hex, privateKey?: Hex);
    private getRelayFees;
    private _createUserBucket;
    createSchemaBucket(name: string, schemaId: Hex, executorData: BytesLike): Promise<`0x${string}`>;
    private _createUserPolicy;
    _createSchemaPolicy(name: string, schemaId: Hex, createPolicyData: BytesLike, value: bigint): Promise<`0x${string}`>;
    transferOwnership(address: Hex): Promise<`0x${string}`>;
    topUpBNB(amount: BigNumberish): Promise<`0x${string}`>;
    executeGreenfieldCommand(msgTypes: number[], msgData: BytesLike[]): Promise<`0x${string}`>;
    getCreatedBuckets(index: BigNumberish): Promise<unknown>;
    hasExistedBucket(): Promise<unknown>;
    callbackGasLimit(): Promise<unknown>;
    getName(name: string, schemaId: Hex): Promise<unknown>;
    createUserBucket(address: Hex): Promise<`0x${string}`>;
    createSchemabucket(address: Hex, name: string, schemaId: Hex): Promise<`0x${string}`>;
    createUserPolicy(_bucketManager: string, eoa: string): Promise<`0x${string}`>;
    createSchemaPolicy(_bucketManager: string, eoa: string, name: string, schemaId: Hex): Promise<`0x${string}`>;
}
