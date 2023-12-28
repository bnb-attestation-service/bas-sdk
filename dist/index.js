import { EAS, SchemaRegistry, SchemaEncoder, } from "@ethereum-attestation-service/eas-sdk";
import { GreenFieldClient } from "./greenFieldClient";
export { SchemaEncoder, SchemaRegistry };
export class BAS extends EAS {
    greenFieldClient;
    constructor(basContractAddress, greenFieldUrl, greenFieldChainId) {
        super(basContractAddress);
        this.greenFieldClient = new GreenFieldClient(greenFieldUrl, greenFieldChainId);
    }
}
//# sourceMappingURL=index.js.map