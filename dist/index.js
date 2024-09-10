"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossChain = exports.ManagerFactory = exports.BucketRegistry = exports.BucketManager = exports.BAS = exports.encodeAddrToBucketName = exports.SchemaRegistry = exports.SchemaEncoder = void 0;
const eas_sdk_1 = require("@ethereum-attestation-service/eas-sdk");
Object.defineProperty(exports, "SchemaRegistry", { enumerable: true, get: function () { return eas_sdk_1.SchemaRegistry; } });
Object.defineProperty(exports, "SchemaEncoder", { enumerable: true, get: function () { return eas_sdk_1.SchemaEncoder; } });
const greenFieldClient_1 = require("./greenFieldClient");
const helper_1 = require("./helper");
Object.defineProperty(exports, "encodeAddrToBucketName", { enumerable: true, get: function () { return helper_1.encodeAddrToBucketName; } });
const bucketManager_1 = require("./lib/bucketManager");
Object.defineProperty(exports, "BucketManager", { enumerable: true, get: function () { return bucketManager_1.BucketManager; } });
const bucketRegistry_1 = require("./lib/bucketRegistry");
Object.defineProperty(exports, "BucketRegistry", { enumerable: true, get: function () { return bucketRegistry_1.BucketRegistry; } });
const managerFactory_1 = require("./lib/managerFactory");
Object.defineProperty(exports, "ManagerFactory", { enumerable: true, get: function () { return managerFactory_1.ManagerFactory; } });
const crossChain_1 = require("./lib/crossChain");
Object.defineProperty(exports, "CrossChain", { enumerable: true, get: function () { return crossChain_1.CrossChain; } });
class BAS extends eas_sdk_1.EAS {
    greenFieldClient;
    // bucketFactory: ManagerFactory;
    // bucketManager: BucketManager;
    // bucketRegistry: BucketRegistry;
    // crossChain: CrossChain;
    constructor(basContractAddress, greenFieldUrl, greenFieldChainId
    // bucketManagerAddress?: string
    ) {
        super(basContractAddress);
        this.greenFieldClient = new greenFieldClient_1.GreenFieldClient(greenFieldUrl, greenFieldChainId);
    }
}
exports.BAS = BAS;
//# sourceMappingURL=index.js.map