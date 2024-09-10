"use strict";
// import {
//   Base,
//   RequireSigner,
//   TransactionProvider,
//   TransactionSigner,
// } from "transaction";
// import {
//   BucketManager,
//   BucketRegistry,
//   BucketFactory,
//   ICrossChain,
//   BucketManager__factory,
//   BucketRegistry__factory,
//   BucketFactory__factory,
//   ICrossChain__factory,
// } from "@bnb-attestation-service/bas-contracts";
// import { parseEther } from "viem";
// import { ContractRunner } from "ethers";
// export interface BASOptions {
//   signer?: TransactionSigner | TransactionProvider;
//   managerAddress: string;
//   registryAddress: string;
//   factoryAddress: string;
//   crosschainAddress: string;
// }
// export class BAS {
//   private manager?: Base<BucketManager>;
//   private registry: Base<BucketRegistry>;
//   private factory: Base<BucketFactory>;
//   // private crosschain: Base<ICrossChain>;
//   private signer?: TransactionSigner | TransactionProvider;
//   constructor(options?: BASOptions) {
//     const {
//       signer,
//       managerAddress,
//       registryAddress,
//       factoryAddress,
//       // crosschainAddress,
//     } = options || {};
//     this.signer = signer;
//     if (!managerAddress || !registryAddress || !factoryAddress) {
//       throw new Error("Contract addresses not defined");
//     }
//     this.manager = new Base<BucketManager>(
//       new BucketManager__factory(),
//       managerAddress,
//       signer
//     );
//     this.registry = new Base<BucketRegistry>(
//       new BucketRegistry__factory(),
//       registryAddress,
//       signer
//     );
//     this.factory = new Base<BucketFactory>(
//       new BucketFactory__factory(),
//       factoryAddress,
//       signer
//     );
//   }
//   // Connects the API to a specific signer
//   public connect(signer: TransactionSigner | TransactionProvider) {
//     if (!this.manager) {
//       throw new Error("Manager contract not deployed");
//     }
//     this.manager.connect(signer);
//     this.registry.connect(signer);
//     this.factory.connect(signer);
//     // this.crosschain.connect(signer);
//     return this;
//   }
//   // Deploy Bucket manager contract
//   @RequireSigner
//   public async deployManager(managerFactoryAddress: string, salt: string): Promise<string> {
//     // get signer address
//     const factory = BucketFactory__factory.connect(managerFactoryAddress, this.signer  as unknown as ContractRunner);
//     const CROSS_CHAIN = await factory.cross_chain();
//     const crossChain = await new Base<ICrossChain>(
//       // @ts-ignore
//       // TODO: ts error to solve
//       new ICrossChain__factory(),
//       "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7",
//       CROSS_CHAIN
//     ).contract;
//     const [relayFee, ackRelayFee] = await crossChain.getRelayFees();
//     const transferOutAmt = parseEther("0.005");
//     const _bucketManager = await factory.getManagerAddress(salt);
//     console.log("deploy manager:", _bucketManager);
//     const value = transferOutAmt + relayFee + ackRelayFee;
//     const resp = await factory.deploy(transferOutAmt, salt, { value });
//     console.log(`create bucket manager contract in tx ${resp.hash}`);
//     await resp.wait();
//     return _bucketManager;
//   }
// }
//# sourceMappingURL=bas.js.map