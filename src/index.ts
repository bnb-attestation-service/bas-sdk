import {
  EAS,
  SchemaRegistry,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { GreenFieldClient } from "./greenFieldClient";
import { encodeAddrToBucketName } from "./helper";

export { SchemaEncoder, SchemaRegistry };
export { encodeAddrToBucketName };

export class BAS extends EAS {
  greenFieldClient: GreenFieldClient;

  constructor(
    basContractAddress: string,
    greenFieldUrl: string,
    greenFieldChainId: string
  ) {
    super(basContractAddress);
    this.greenFieldClient = new GreenFieldClient(
      greenFieldUrl,
      greenFieldChainId
    );
  }
}
