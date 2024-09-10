"use strict";
// import {
//   EAS,
//   SchemaRegistry,
//   SchemaEncoder,
// } from "@ethereum-attestation-service/eas-sdk";
// import { GreenFieldClient } from "./greenFieldClient";
// import { encodeAddrToBucketName } from "./helper";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossChain = exports.ManagerFactory = exports.BucketRegistry = exports.BucketManager = void 0;
// export { SchemaEncoder, SchemaRegistry };
// export { encodeAddrToBucketName };
// export class BAS extends EAS {
//   greenFieldClient: GreenFieldClient;
//   constructor(
//     basContractAddress: string,
//     greenFieldUrl: string,
//     greenFieldChainId: string
//   ) {
//     super(basContractAddress);
//     this.greenFieldClient = new GreenFieldClient(
//       greenFieldUrl,
//       greenFieldChainId
//     );
//   }
// }
var bucketManager_1 = require("./lib/bucketManager");
Object.defineProperty(exports, "BucketManager", { enumerable: true, get: function () { return bucketManager_1.BucketManager; } });
var bucketRegistry_1 = require("./lib/bucketRegistry");
Object.defineProperty(exports, "BucketRegistry", { enumerable: true, get: function () { return bucketRegistry_1.BucketRegistry; } });
var managerFactory_1 = require("./lib/managerFactory");
Object.defineProperty(exports, "ManagerFactory", { enumerable: true, get: function () { return managerFactory_1.ManagerFactory; } });
var crossChain_1 = require("./lib/crossChain");
Object.defineProperty(exports, "CrossChain", { enumerable: true, get: function () { return crossChain_1.CrossChain; } });
//# sourceMappingURL=index.js.map