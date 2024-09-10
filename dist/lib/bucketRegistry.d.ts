import { BaseContract } from "../utils/baseContract";
import { Hex } from "viem";
export declare class BucketRegistry extends BaseContract {
    /**
     - Register bucket manager contract (only called by bucket factory)
    - Register bucket (only called by bucket manager contract)
    - Update controller of bucket manager contract info (only called by owner of bucket manager contract)
    
    - Get the bucket manager list  (`called by user`)
    - Get the bucket managers controlled by some user  (`called by user`)
    - Get created bucket list  (`called by user`)
    */
    constructor(contractAddress: Hex, privateKey?: Hex);
    getBucketManagers(): Promise<unknown>;
    getControlledManagers(address: Hex): Promise<unknown>;
    getBucketList(): Promise<unknown>;
}
