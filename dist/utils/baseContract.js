"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContract = void 0;
const tslib_1 = require("tslib");
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
// Decorator to try catch error from method, and pass an argument to define the error message
function CatchError(message) {
    return function (_target, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                console.error(message, error);
                throw error;
            }
        };
    };
}
class BaseContract {
    abi;
    contractAddress;
    publicClient;
    walletClient;
    chain;
    constructor(contractABI, contractAddress, privateKey) {
        this.chain = chains_1.bscTestnet;
        this.contractAddress = contractAddress;
        this.abi = contractABI;
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: this.chain,
            transport: (0, viem_1.http)(),
        });
        if (privateKey) {
            const account = (0, accounts_1.privateKeyToAccount)(privateKey);
            this.walletClient = (0, viem_1.createWalletClient)({
                account: account || undefined,
                chain: this.chain,
                transport: (0, viem_1.http)(),
            });
        }
    }
    async read(params) {
        const value = await this.publicClient.readContract({
            address: this.contractAddress,
            abi: this.abi,
            functionName: params.functionName,
            args: params.args,
        });
        return value;
    }
    async write(params) {
        if (!this.walletClient) {
            throw new Error("Wallet client not initialized. Private key is required for this operation.");
        }
        const hash = await this.walletClient.writeContract({
            address: this.contractAddress,
            abi: this.abi,
            functionName: params.functionName,
            args: params.args,
            account: this.walletClient.account || "0x",
            chain: this.chain,
            value: params.value,
        });
        const receipt = await this.publicClient.waitForTransactionReceipt({
            hash,
        });
        return receipt.transactionHash;
    }
}
exports.BaseContract = BaseContract;
tslib_1.__decorate([
    CatchError("Error reading contract:")
], BaseContract.prototype, "read", null);
tslib_1.__decorate([
    CatchError("Error writing contract:")
], BaseContract.prototype, "write", null);
//# sourceMappingURL=baseContract.js.map