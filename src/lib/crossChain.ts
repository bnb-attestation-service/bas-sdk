import { BaseContract } from "../utils/baseContract";
import abi from "../abi/crosschain.abi.json";
import { Hex } from "viem";

export class CrossChain extends BaseContract {
  constructor(contractAddress: Hex, privateKey?: Hex) {
    super(abi, contractAddress, privateKey);
  }

  /*
  Mothods:
    - Deploy manager contract (called by user)
  */
  // async deployManagerContract(amnt: number, salt: string) {
  //   return await this.write({
  //     functionName: "deploy",
  //     args: [amnt, salt],
  //   });
  // }

  async getRelayFees () {
    return await this.read({
      functionName: "getRelayFees",
      args: [],
    });
  }
}
