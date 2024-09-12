"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketManager = void 0;
const tslib_1 = require("tslib");
//@ts-ignore
const bsc_cross_greenfield_sdk_1 = require("@bnb-chain/bsc-cross-greenfield-sdk");
const types_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/permission/types");
const types_2 = require("@bnb-chain/greenfield-cosmos-types/greenfield/resource/types");
const common_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/permission/common");
const baseContract_1 = require("../utils/baseContract");
const manager_abi_json_1 = tslib_1.__importDefault(require("../abi/manager.abi.json"));
const crossChain_1 = require("./crossChain");
const utils_1 = require("../utils");
const greenfield_js_sdk_1 = require("@bnb-chain/greenfield-js-sdk");
class BucketManager extends baseContract_1.BaseContract {
    crosschain;
    greenfieldClient;
    constructor(contractAddress, privateKey, greenFieldConfig) {
        super(manager_abi_json_1.default, contractAddress, privateKey);
        this.crosschain = new crossChain_1.CrossChain(privateKey);
        this.greenfieldClient = greenfield_js_sdk_1.Client.create(greenFieldConfig.rpcUrl, greenFieldConfig.chainId);
    }
    async getRelayFees() {
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
    async _createUserBucket(executorData) {
        return await this.write({
            functionName: "createUserBucket",
            args: [executorData],
        });
    }
    async createSchemaBucket(name, schemaId, executorData) {
        return await this.write({
            functionName: "createSchemaBucket",
            args: [name, schemaId, executorData],
        });
    }
    async _createUserPolicy(data, value) {
        return await this.write({
            functionName: "createUserPolicy",
            args: [data],
            value,
        });
    }
    async _createSchemaPolicy(name, schemaId, createPolicyData, value) {
        return await this.write({
            functionName: "createSchemaPolicy",
            args: [name, schemaId, createPolicyData],
            value,
        });
    }
    async transferOwnership(address) {
        return await this.write({
            functionName: "transferOwnership",
            args: [address],
        });
    }
    async topUpBNB(amount) {
        return await this.write({
            functionName: "topUpBNB",
            args: [amount],
        });
    }
    async executeGreenfieldCommand(msgTypes, msgData) {
        return await this.write({
            functionName: "greenfieldExecutor",
            args: [msgTypes, msgData],
        });
    }
    async getCreatedBuckets(index) {
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
    async getName(name, schemaId) {
        return this.read({
            functionName: "getName",
            args: [name, schemaId],
        });
    }
    async createUserBucket(address) {
        const callbackGasLimit = (await this.callbackGasLimit());
        console.log({ callbackGasLimit });
        const userBucketName = await this.getName("", utils_1.ZERO_BYTES32);
        const userDataSetBucketFlowRateLimit = bsc_cross_greenfield_sdk_1.ExecutorMsg.getSetBucketFlowRateLimitParams({
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
        }
        else {
            throw new Error("get relay fees error");
        }
        console.log({ userValue });
        const userExecutorData = userDataSetBucketFlowRateLimit[1];
        return this._createUserBucket(userExecutorData);
    }
    async createSchemabucket(address, name, schemaId) {
        const [relayFee, ackRelayFee] = await this.getRelayFees();
        const gasPrice = 10000000000n;
        const callbackGasLimit = (await this.callbackGasLimit());
        const schemaBucketName = await this.getName(name, schemaId);
        const schemaDataSetBucketFlowRateLimit = bsc_cross_greenfield_sdk_1.ExecutorMsg.getSetBucketFlowRateLimitParams({
            bucketName: schemaBucketName,
            bucketOwner: address,
            operator: address,
            paymentAddress: address,
            flowRateLimit: "100000000000000000",
        });
        const schemaExecutorData = schemaDataSetBucketFlowRateLimit[1];
        const schemaValue = 2n * relayFee + ackRelayFee + callbackGasLimit * gasPrice;
        console.log({ schemaValue });
        return this.createSchemaBucket(name, schemaId, schemaExecutorData);
    }
    async createUserPolicy(_bucketManager, eoa) {
        // const bucketName = await this.getName("", ZERO_BYTES32);
        const [relayFee, ackRelayFee] = await this.getRelayFees();
        const gasPrice = 10000000000n;
        const callbackGasLimit = (await this.callbackGasLimit());
        const userValue = relayFee + ackRelayFee + callbackGasLimit * gasPrice;
        const bucketName = (await this.getName("", utils_1.ZERO_BYTES32));
        const bucketInfo = await this.greenfieldClient.bucket.getBucketMeta({ bucketName });
        const bucketId = bucketInfo.body.GfSpGetBucketMetaResponse.Bucket.BucketInfo.Id;
        const policyDataToAllowUserOperateBucket = types_1.Policy.encode({
            id: "0",
            resourceId: bucketId,
            resourceType: types_2.ResourceType.RESOURCE_TYPE_BUCKET,
            statements: [
                {
                    effect: common_1.Effect.EFFECT_ALLOW,
                    actions: [common_1.ActionType.ACTION_CREATE_OBJECT],
                    resources: [],
                },
            ],
            principal: {
                type: common_1.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
                value: eoa,
            },
        }).finish();
        return this._createUserPolicy(policyDataToAllowUserOperateBucket, userValue);
    }
    async createSchemaPolicy(_bucketManager, eoa, name, schemaId) {
        // const bucketName = await this.getName(name, schemaId);
        const bucketName = (await this.getName(name, schemaId));
        const bucketInfo = await this.greenfieldClient.bucket.getBucketMeta({ bucketName });
        const bucketId = bucketInfo.body.GfSpGetBucketMetaResponse.Bucket.BucketInfo.Id;
        const [relayFee, ackRelayFee] = await this.getRelayFees();
        const policyDataToAllowUserOperateBucket = types_1.Policy.encode({
            id: "0",
            resourceId: bucketId,
            resourceType: types_2.ResourceType.RESOURCE_TYPE_BUCKET,
            statements: [
                {
                    effect: common_1.Effect.EFFECT_ALLOW,
                    actions: [common_1.ActionType.ACTION_CREATE_OBJECT],
                    resources: [],
                },
            ],
            principal: {
                type: common_1.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
                value: eoa,
            },
        }).finish();
        return this._createSchemaPolicy(name, schemaId, policyDataToAllowUserOperateBucket, relayFee + ackRelayFee);
    }
}
exports.BucketManager = BucketManager;
//# sourceMappingURL=bucketManager.js.map