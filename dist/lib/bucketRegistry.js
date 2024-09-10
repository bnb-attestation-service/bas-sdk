"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketRegistry = void 0;
const tslib_1 = require("tslib");
const baseContract_1 = require("../utils/baseContract");
const registry_abi_json_1 = tslib_1.__importDefault(require("../abi/registry.abi.json"));
class BucketRegistry extends baseContract_1.BaseContract {
    /**
     - Register bucket manager contract (only called by bucket factory)
    - Register bucket (only called by bucket manager contract)
    - Update controller of bucket manager contract info (only called by owner of bucket manager contract)
    
    - Get the bucket manager list  (`called by user`)
    - Get the bucket managers controlled by some user  (`called by user`)
    - Get created bucket list  (`called by user`)
    */
    constructor(contractAddress, privateKey) {
        super(registry_abi_json_1.default, contractAddress, privateKey);
    }
    async getBucketManagers() {
        return await this.read({
            functionName: "getRegisteredManagers",
            args: [],
        });
    }
    async getControlledManagers(address) {
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
exports.BucketRegistry = BucketRegistry;
//# sourceMappingURL=bucketRegistry.js.map