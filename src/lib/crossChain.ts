import { BaseContract } from "../utils/baseContract";
import abi from "../abi/crosschain.abi.json";
import { Hex } from "viem";

export class CrossChain extends BaseContract {
  constructor(privateKey?: Hex) {
    super(abi, "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7", privateKey);
  }

  /*
  Mothods:
    - Deploy manager contract (called by user)
  */

  async getRelayFees(): Promise<any> {
    return await this.read({
      functionName: "getRelayFees",
      args: [],
    });
  }
}
