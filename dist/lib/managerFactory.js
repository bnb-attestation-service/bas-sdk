"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerFactory = void 0;
const tslib_1 = require("tslib");
const baseContract_1 = require("../utils/baseContract");
const factory_abi_json_1 = tslib_1.__importDefault(require("../abi/factory.abi.json"));
const viem_1 = require("viem");
const crossChain_1 = require("./crossChain");
class ManagerFactory extends baseContract_1.BaseContract {
    crosschain;
    constructor(contractAddress, privateKey) {
        super(factory_abi_json_1.default, contractAddress, privateKey);
        this.crosschain = new crossChain_1.CrossChain(privateKey);
    }
    /*
    Mothods:
      - Deploy manager contract (called by user)
    */
    async deployManagerContract(amnt, salt, value) {
        return await this.write({
            functionName: "deploy",
            args: [amnt, salt],
            value,
        });
    }
    async getManagerAddress(salt) {
        return await this.read({
            functionName: "getManagerAddress",
            args: [salt],
        });
    }
    async deployBucketManager(saltStr) {
        const fees = await this.crosschain.getRelayFees();
        const transferOutAmt = (0, viem_1.parseEther)("0.005");
        let topAmnt = transferOutAmt;
        if (Array.isArray(fees)) {
            const [relayFee, ackRelayFee] = fees;
            topAmnt = topAmnt + relayFee + ackRelayFee;
        }
        else {
            throw new Error("get relay fees error");
        }
        const salt = (0, viem_1.hashMessage)(saltStr);
        const _bucketManager = await this.getManagerAddress(salt);
        console.log("deploy manager:", _bucketManager);
        const resp = await this.deployManagerContract(transferOutAmt, salt, topAmnt);
        console.log(`create bucket manager contract in tx ${resp}`);
        // console.log(_bucketManager);
        return _bucketManager;
    }
}
exports.ManagerFactory = ManagerFactory;
//# sourceMappingURL=managerFactory.js.map