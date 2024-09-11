import { BaseContract } from "../utils/baseContract";
import abi from "../abi/factory.abi.json";
import { hashMessage, Hex, parseEther } from "viem";
import { BigNumberish, BytesLike } from "ethers";
import { CrossChain } from "./crossChain";

export class ManagerFactory extends BaseContract {
  private crosschain: CrossChain;

  constructor(contractAddress: Hex, privateKey?: Hex) {
    super(abi, contractAddress, privateKey);
    this.crosschain = new CrossChain(privateKey);
  }

  /*
  Mothods:
    - Deploy manager contract (called by user)
  */
  private async deployManagerContract(amnt: BigNumberish, salt: BytesLike, value: bigint) {
    return await this.write({
      functionName: "deploy",
      args: [amnt, salt],
      value,
    });
  }

  async getManagerAddress(salt: BytesLike) {
    return await this.read({
      functionName: "getManagerAddress",
      args: [salt],
    }); 
  }

  async deployBucketManager(saltStr: string) {
    const fees = await this.crosschain.getRelayFees();
    const transferOutAmt = parseEther("0.005");
    let topAmnt = transferOutAmt;

    if (Array.isArray(fees)) {
      const [relayFee, ackRelayFee] = fees;
      topAmnt = topAmnt + relayFee + ackRelayFee;
    } else {
      throw new Error("get relay fees error");
    }

    const salt = hashMessage(saltStr);
    const _bucketManager = await this.getManagerAddress(salt);
    console.log("deploy manager:", _bucketManager);

    const resp = await this.deployManagerContract(transferOutAmt, salt, topAmnt);
    console.log(`create bucket manager contract in tx ${resp}`);
    // console.log(_bucketManager);
    return _bucketManager;
  }
}
