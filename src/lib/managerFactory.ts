import { BaseContract } from "../utils/baseContract";
import abi from "../abi/factory.abi.json";
import { Hex } from "viem";
import { BigNumberish, BytesLike } from "ethers";

export class ManagerFactory extends BaseContract {
  constructor(contractAddress: Hex, privateKey?: Hex) {
    super(abi, contractAddress, privateKey);
  }

  /*
  Mothods:
    - Deploy manager contract (called by user)
  */
  async deployManagerContract(amnt: BigNumberish, salt: BytesLike) {
    return await this.write({
      functionName: "deploy",
      args: [amnt, salt],
    });
  }
}
