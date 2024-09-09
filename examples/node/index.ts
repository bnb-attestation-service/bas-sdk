import { BucketManager } from "../../src/lib/bucketManager";
import inquirer from "inquirer";
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
    message: "Please input your pKey",
  },
];
async function main(privateKey) {
  const bas = new BucketManager(
    "0xa75A8E4021CEE540aD61e5E91be33947714E1B7A",
    privateKey
  );
}
inquirer
 // @ts-ignore
 .prompt(pkeyQ)
  .then(main)
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
