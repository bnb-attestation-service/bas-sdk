"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerFactory = void 0;
const tslib_1 = require("tslib");
const baseContract_1 = require("../utils/baseContract");
const factory_abi_json_1 = tslib_1.__importDefault(require("../abi/factory.abi.json"));
class ManagerFactory extends baseContract_1.BaseContract {
    constructor(contractAddress, privateKey) {
        super(factory_abi_json_1.default, contractAddress, privateKey);
    }
    /*
    Mothods:
      - Deploy manager contract (called by user)
    */
    async deployManagerContract(amnt, salt) {
        return await this.write({
            functionName: "deploy",
            args: [amnt, salt],
        });
    }
}
exports.ManagerFactory = ManagerFactory;
//# sourceMappingURL=managerFactory.js.map