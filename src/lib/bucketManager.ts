import { BaseContract } from "../utils/base";
import abi from "../abi/manager.abi.json";
import { Hex } from "viem";

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
  async createUserBucket() {
    return await super.write({
      functionName: "createUserBucket",
      args: [],
    });
  }

  async createSchemaBucket() {
    return await super.write({
      functionName: "createSchemaBucket",
      args: [],
    });
  }

  async createUserPolicy() {
    return await super.write({
      functionName: "createUserPolicy",
      args: [],
    });
  }

  async createSchemaPolicy() {
    return await super.write({
      functionName: "createSchemaPolicy",
      args: [],
    });
  }

  async transferOwnership() {
    return await super.write({
      functionName: "transferOwnership",
      args: [],
    });
  }

  async topUpBNB() {
    return await super.write({
      functionName: "topUpBNB",
      args: [],
    });
  }

  async executeGreenfieldCommand() {
    return await super.write({
      functionName: "greenfieldCall",
      args: [],
    });
  }

  async getBucketsCreatedByManagerContract() {
    return await super.read({
      functionName: "getBucketsCreatedByManagerContract",
      args: [],
    });
  }

  async getWhetherTheManagerContractCreateAUserBucket() {
    return await super.read({
      functionName: "getWhetherTheManagerContractCreateAUserBucket",
      args: [],
    });
  }
}
