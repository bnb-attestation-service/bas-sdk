import { BaseContract } from "../utils/baseContract";
import abi from "../abi/manager.abi.json";
import { Hex } from "viem";
import { BigNumberish, BytesLike } from "ethers";

export class BucketManager extends BaseContract {
  constructor(contractAddress: Hex, privateKey?: Hex) {
    super(abi, contractAddress, privateKey);
  }

  /*
  Methods:
  - Create user bucket (`only owner`)
  - Create schema bucket  (`only owner`)
  - Create policy for user bucket   (`only owner`)
  - Create policy for schema bucket  (`only owner`)
  - Transfer ownerships to  (`only owner`)
  - Top up BNB for bucket manage contract in GF  (`called by user`)
  - Execute greenfield command (`only owner`)
  - Get buckets created by manager contract  (`called by user`)
  - Get whether the manager contract create a user bucket (`called by user`)
  */
  async createUserBucket(executorData: BytesLike) {
    return await this.write({
      functionName: "createUserBucket",
      args: [executorData],
    });
  }

  async createSchemaBucket(name: string, schemaId: Hex, executorData: BytesLike) {
    return await this.write({
      functionName: "createSchemaBucket",
      args: [name, schemaId, executorData],
    });
  }

  async createUserPolicy(data: BytesLike) {
    return await this.write({
      functionName: "createUserPolicy",
      args: [data],
    });
  }

  async createSchemaPolicy(name: string, schemaId: Hex, createPolicyData: BytesLike) {
    return await this.write({
      functionName: "createSchemaPolicy",
      args: [name, schemaId, createPolicyData],
    });
  }

  async transferOwnership(address: Hex) {
    return await this.write({
      functionName: "transferOwnership",
      args: [address],
    });
  }

  async topUpBNB(amount: BigNumberish) {
    return await this.write({
      functionName: "topUpBNB",
      args: [amount],
    });
  }

  async executeGreenfieldCommand(msgTypes: number[], msgData: BytesLike[]) {
    return await this.write({
      functionName: "greenfieldExecutor",
      args: [msgTypes, msgData],
    });
  }

  async getCreatedBuckets(index: BigNumberish) {
    return await this.read({
      functionName: "bucketNames",
      args: [index],
    });
  }

  async hasExistedBucket() {
    return await this.read({
      functionName: "basBucket",
      args: [],
    });
  }
}
