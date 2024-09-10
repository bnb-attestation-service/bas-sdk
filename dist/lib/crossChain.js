"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossChain = void 0;
const tslib_1 = require("tslib");
const baseContract_1 = require("../utils/baseContract");
const crosschain_abi_json_1 = tslib_1.__importDefault(require("../abi/crosschain.abi.json"));
class CrossChain extends baseContract_1.BaseContract {
    constructor(privateKey) {
        super(crosschain_abi_json_1.default, "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7", privateKey);
    }
    /*
    Mothods:
      - Deploy manager contract (called by user)
    */
    async getRelayFees() {
        return await this.read({
            functionName: "getRelayFees",
            args: [],
        });
    }
}
exports.CrossChain = CrossChain;
//# sourceMappingURL=crossChain.js.map