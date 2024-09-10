import {
  EAS,
  SchemaRegistry,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { GreenFieldClient } from "./greenFieldClient";
import { encodeAddrToBucketName } from "./helper";
import { BucketManager } from "./lib/bucketManager";
import { BucketRegistry } from "./lib/bucketRegistry";
import { ManagerFactory } from "./lib/managerFactory";
import { CrossChain } from "./lib/crossChain";

// const DEFAULT_CONTRACT_ADDRESS = {
//   // managerAddress: '0xa75A8E4021CEE540aD61e5E91be33947714E1B7A',
//   registryAddress: "0xAd1300f65603E3f1d8074b676d891c3359CE1aF3",
//   factoryAddress: "0xF1e808Fcf29Eb3Be2d3EE8B921D602d568DcFAba",
//   crosschainAddress: "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7",
// } as const;

export { SchemaEncoder, SchemaRegistry };
export { encodeAddrToBucketName };

export class BAS extends EAS {
  greenFieldClient: GreenFieldClient;
  // bucketFactory: ManagerFactory;
  // bucketManager: BucketManager;
  // bucketRegistry: BucketRegistry;
  // crossChain: CrossChain;

  constructor(
    basContractAddress: string,
    greenFieldUrl: string,
    greenFieldChainId: string
    // bucketManagerAddress?: string
  ) {
    super(basContractAddress);
    this.greenFieldClient = new GreenFieldClient(
      greenFieldUrl,
      greenFieldChainId
    );
  }
}

export { BucketManager, BucketRegistry, ManagerFactory, CrossChain };
