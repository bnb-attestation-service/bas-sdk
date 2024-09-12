import { Hex } from "viem";
import { BigNumberish, BytesLike } from "ethers";
//@ts-ignore
import { ExecutorMsg } from "@bnb-chain/bsc-cross-greenfield-sdk";
import { Policy } from "@bnb-chain/greenfield-cosmos-types/greenfield/permission/types";
import { ResourceType } from "@bnb-chain/greenfield-cosmos-types/greenfield/resource/types";
import {
  ActionType,
  Effect,
  PrincipalType,
} from "@bnb-chain/greenfield-cosmos-types/greenfield/permission/common";

import { BaseContract } from "../utils/baseContract";
import abi from "../abi/manager.abi.json";
import { CrossChain } from "./crossChain";
import { ZERO_BYTES32 } from "../utils";
import { Client } from '@bnb-chain/greenfield-js-sdk';

export interface GreenFieldConfig {
  rpcUrl: string;
  chainId: string;
}
export class BucketManager extends BaseContract {
  private crosschain: CrossChain;
  private greenfieldClient: Client;

  constructor(contractAddress: Hex, privateKey: Hex, greenFieldConfig: GreenFieldConfig) {
    super(abi, contractAddress, privateKey);
    this.crosschain = new CrossChain(privateKey);
    this.greenfieldClient = Client.create(greenFieldConfig.rpcUrl, greenFieldConfig.chainId);
  }

  private async getRelayFees() {
    return this.crosschain.getRelayFees();
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
  private async _createUserBucket(executorData: BytesLike) {
    return await this.write({
      functionName: "createUserBucket",
      args: [executorData],
    });
  }

  async createSchemaBucket(
    name: string,
    schemaId: Hex,
    executorData: BytesLike
  ) {
    return await this.write({
      functionName: "createSchemaBucket",
      args: [name, schemaId, executorData],
    });
  }

  private async _createUserPolicy(data: BytesLike, value: bigint) {
    return await this.write({
      functionName: "createUserPolicy",
      args: [data],
      value,
    });
  }

  async _createSchemaPolicy(
    name: string,
    schemaId: Hex,
    createPolicyData: BytesLike,
    value: bigint,
  ) {
    return await this.write({
      functionName: "createSchemaPolicy",
      args: [name, schemaId, createPolicyData],
      value,
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

  async callbackGasLimit() {
    return await this.read({
      functionName: "callbackGasLimit",
      args: [],
    });
  }

  async getName(name: string, schemaId: Hex) {
    return this.read({
      functionName: "getName",
      args: [name, schemaId],
    });
  }

  async createUserBucket(address: Hex) {
    const callbackGasLimit = (await this.callbackGasLimit()) as bigint;
    console.log({ callbackGasLimit });

    const userBucketName = await this.getName("", ZERO_BYTES32);

    const userDataSetBucketFlowRateLimit =
      ExecutorMsg.getSetBucketFlowRateLimitParams({
        bucketName: userBucketName,
        bucketOwner: address,
        operator: address,
        paymentAddress: address,
        flowRateLimit: "100000000000000000",
      });

    // TODO: use decorator to get fees
    const fees = await this.getRelayFees();
    const gasPrice = 10000000000n;

    let userValue = 0n;
    if (Array.isArray(fees)) {
      const [relayFee, ackRelayFee] = fees;
      userValue = 2n * relayFee + ackRelayFee + callbackGasLimit * gasPrice;
    } else {
      throw new Error("get relay fees error");
    }

    console.log({ userValue });

    const userExecutorData = userDataSetBucketFlowRateLimit[1];

    return this._createUserBucket(userExecutorData);
  }

  async createSchemabucket(address: Hex, name: string, schemaId: Hex) {
    const [relayFee, ackRelayFee] = await this.getRelayFees();

    const gasPrice = 10000000000n;
    const callbackGasLimit = (await this.callbackGasLimit()) as bigint;
    const schemaBucketName = await this.getName(name, schemaId);

    const schemaDataSetBucketFlowRateLimit =
      ExecutorMsg.getSetBucketFlowRateLimitParams({
        bucketName: schemaBucketName,
        bucketOwner: address,
        operator: address,
        paymentAddress: address,
        flowRateLimit: "100000000000000000",
      });
    const schemaExecutorData = schemaDataSetBucketFlowRateLimit[1];
    const schemaValue =
      2n * relayFee + ackRelayFee + callbackGasLimit * gasPrice;
    console.log({ schemaValue });
    return this.createSchemaBucket(name, schemaId, schemaExecutorData);
  }

  async createUserPolicy(_bucketManager: string, eoa: string) {
    // const bucketName = await this.getName("", ZERO_BYTES32);

    const [relayFee, ackRelayFee] = await this.getRelayFees();
    const gasPrice = 10000000000n;
    const callbackGasLimit = (await this.callbackGasLimit()) as bigint;

    const userValue = relayFee + ackRelayFee + callbackGasLimit * gasPrice;

    const bucketName = (await this.getName("",ZERO_BYTES32)) as string;
    const bucketInfo = await this.greenfieldClient.bucket.getBucketMeta({ bucketName });
    const bucketId = bucketInfo.body!.GfSpGetBucketMetaResponse.Bucket.BucketInfo.Id;

    const policyDataToAllowUserOperateBucket = Policy.encode({
      id: "0",
      resourceId: bucketId,
      resourceType: ResourceType.RESOURCE_TYPE_BUCKET,
      statements: [
        {
          effect: Effect.EFFECT_ALLOW,
          actions: [ActionType.ACTION_CREATE_OBJECT],
          resources: [],
        },
      ],
      principal: {
        type: PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
        value: eoa,
      },
    }).finish();

    return this._createUserPolicy(policyDataToAllowUserOperateBucket, userValue);
  }

  async createSchemaPolicy(
    _bucketManager: string,
    eoa: string,
    name: string,
    schemaId: Hex
  ) {
    // const bucketName = await this.getName(name, schemaId);

    const bucketName = (await this.getName(name, schemaId)) as string;
    const bucketInfo = await this.greenfieldClient.bucket.getBucketMeta({ bucketName });
    const bucketId = bucketInfo.body!.GfSpGetBucketMetaResponse.Bucket.BucketInfo.Id;

    const [relayFee, ackRelayFee] = await this.getRelayFees();

    const policyDataToAllowUserOperateBucket = Policy.encode({
      id: "0",
      resourceId: bucketId,
      resourceType: ResourceType.RESOURCE_TYPE_BUCKET,
      statements: [
        {
          effect: Effect.EFFECT_ALLOW,
          actions: [ActionType.ACTION_CREATE_OBJECT],
          resources: [],
        },
      ],
      principal: {
        type: PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
        value: eoa,
      },
    }).finish();

    return this._createSchemaPolicy(
      name,
      schemaId,
      policyDataToAllowUserOperateBucket,
      relayFee + ackRelayFee,
    );
  }
}
