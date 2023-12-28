import {
  EAS,
  SchemaRegistry,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { GreenFieldClient } from "./greenFieldClient";

export { SchemaEncoder, SchemaRegistry };

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

