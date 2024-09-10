import { EAS, SchemaRegistry, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { GreenFieldClient } from "./greenFieldClient";
import { encodeAddrToBucketName } from "./helper";
import { BucketManager } from "./lib/bucketManager";
import { BucketRegistry } from "./lib/bucketRegistry";
import { ManagerFactory } from "./lib/managerFactory";
import { CrossChain } from "./lib/crossChain";
export { SchemaEncoder, SchemaRegistry };
export { encodeAddrToBucketName };
export declare class BAS extends EAS {
    greenFieldClient: GreenFieldClient;
    constructor(basContractAddress: string, greenFieldUrl: string, greenFieldChainId: string);
}
export { BucketManager, BucketRegistry, ManagerFactory, CrossChain };
