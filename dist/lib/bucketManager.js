"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketManager = void 0;
const tslib_1 = require("tslib");
const baseContract_1 = require("../utils/baseContract");
const manager_abi_json_1 = tslib_1.__importDefault(require("../abi/manager.abi.json"));
class BucketManager extends baseContract_1.BaseContract {
    constructor(contractAddress, privateKey) {
        super(manager_abi_json_1.default, contractAddress, privateKey);
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
    async createUserBucket(executorData) {
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
    async createUserPolicy(data) {
        return await this.write({
            functionName: "createUserPolicy",
            args: [data],
        });
    }
    async createSchemaPolicy(name, schemaId, createPolicyData) {
        return await this.write({
            functionName: "createSchemaPolicy",
            args: [name, schemaId, createPolicyData],
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
}
exports.BucketManager = BucketManager;
//# sourceMappingURL=bucketManager.js.map