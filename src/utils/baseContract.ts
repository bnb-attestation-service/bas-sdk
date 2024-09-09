import {
  PublicClient,
  WalletClient,
  createPublicClient,
  http,
  createWalletClient,
  Hex,
  Hash,
  Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bscTestnet } from "viem/chains";

export interface CallContractParams {
  functionName: string;
  args: unknown[];
}

// Decorator to try catch error from method, and pass an argument to define the error message
function CatchError(message: string) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        console.error(message, error);
        throw error;
      }
    };
  };
}

export abstract class BaseContract {
  private abi: any;
  private contractAddress: Hex;
  private publicClient: PublicClient;
  private walletClient?: WalletClient;
  private chain: Chain;

  constructor(contractABI: any, contractAddress: Hex, privateKey?: Hex) {
    this.chain = bscTestnet;
    this.contractAddress = contractAddress;
    this.abi = contractABI;

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(),
    });

    if (privateKey) {
      const account = privateKeyToAccount(privateKey);
      this.walletClient = createWalletClient({
        account: account || undefined,
        chain: this.chain,
        transport: http(),
      });
    }
  }

  @CatchError("Error reading contract:")
  async read(params: CallContractParams): Promise<bigint | unknown> {
    const value = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: this.abi,
      functionName: params.functionName,
      args: [],
    });
    return value;
  }

  @CatchError("Error writing contract:")
  async write(params: CallContractParams): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error(
        "Wallet client not initialized. Private key is required for this operation."
      );
    }

    const hash = await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: this.abi,
      functionName: params.functionName,
      args: params.args,
      account: this.walletClient.account || "0x",
      chain: this.chain,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash,
    });
    return receipt.transactionHash;
  }
}
