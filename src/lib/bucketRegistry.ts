import { BaseContract } from "../utils/baseContract";
import abi from "../abi/registry.abi.json";
import { Hex } from "viem";

export class BucketRegistry extends BaseContract {
/**
 - Register bucket manager contract (only called by bucket factory)
- Register bucket (only called by bucket manager contract)
- Update controller of bucket manager contract info (only called by owner of bucket manager contract)

- Get the bucket manager list  (`called by user`)
- Get the bucket managers controlled by some user  (`called by user`)
- Get created bucket list  (`called by user`)
*/
  constructor(contractAddress: Hex, privateKey?: Hex) {
    super(abi, contractAddress, privateKey);
  }

  async getBucketManagers() {
    return await this.read({
      functionName: "getRegisteredManagers",
      args: [],
    });
  }

  async getControlledManagers(address: Hex) {
    return await this.read({
      functionName: "getBucketManagers",
      args: [address],
    });
  }

  // TODO: to confirm method
  async getBucketList() {
    return await this.read({
      functionName: "getBucketList",
      args: [],
    });
  }

}