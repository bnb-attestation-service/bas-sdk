const dotenv = require("dotenv");
dotenv.config();

const {
  BucketManager,
  BucketRegistry,
  CrossChain,
  ManagerFactory,
} = require("../../dist");

/**
  managerAddress: '0xa75A8E4021CEE540aD61e5E91be33947714E1B7A',
  registryAddress: '0xAd1300f65603E3f1d8074b676d891c3359CE1aF3',
  factoryAddress: '0xF1e808Fcf29Eb3Be2d3EE8B921D602d568DcFAba',
  crosschainAddress: '0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7',
 */

const pkeyQ = [
  {
    type: "input",
    name: "private key",
    message: "Please input your pKey\n",
  },
];

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  console.log(privateKey);

  const bucketRegistry = new BucketRegistry(
    "0xAd1300f65603E3f1d8074b676d891c3359CE1aF3",
    privateKey
  );
  // const crossChain = new CrossChain(
  //   "0xa5B2c9194131A4E0BFaCbF9E5D6722c873159cb7",
  //   privateKey
  // );

  const manager = new BucketManager(
    "0xa75A8E4021CEE540aD61e5E91be33947714E1B7A",
    privateKey
  );

  const factory = new ManagerFactory(
    "0xF1e808Fcf29Eb3Be2d3EE8B921D602d568DcFAba",
    privateKey
  );

  // const fees = await crossChain.getRelayFees();
  // const managers = await bucketRegistry.getControlledManagers('0x471543A3bd04486008c8a38c5C00543B73F1769e');
  // console.log({ fees, managers });

  const create = await factory.deployBucketManager("test-salt");

  console.log({ create });
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
