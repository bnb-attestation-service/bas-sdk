# JsSDK

Here, you will find all the necessary information to begin integrating BAS into a Javascript/Typescript project.

## Installing the BAS SDK

To install the BAS JS SDK, run the following command within your project directory:

```bash
yarn add @bnb-attestation-service/bas-sdk
```

OR

```bash
npm install @bnb-attestation-service/bas-sdk
```

OR

```bash
pnpm add @bnb-attestation-service/bas-sdk
```

> If you want to save attestations into GreenField Storage
> You need to import `file-handle.wasm`, please see the example below.

### Import Scripsts Required by GreenField

```html
<head>
  <script
    src="https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/browser/umd/index.js"
  ></script>
  <script
    src="https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/node/file-handle.wasm"
  ></script>
</head>
```
## Using the BAS SDK

To begin, we must import and initialize the library before exploring its functionality.

```jsx
import { BAS, Offchain, SchemaEncoder, SchemaRegistry } from "@bnb-attestation-service/bas-sdk";
import { ethers } from 'ethers';

export const BASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";// Sepolia v0.26

// Initialize the sdk with the address of the BAS Schema contract address
const bas = new BAS(BASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
const provider = ethers.providers.getDefaultProvider(
  "sepolia"
);

// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
bas.connect(provider);

```

> If you want to use features related to GreenField, you need to init the client with your address.

```js
  const gfClient = bas.greenFieldClient;
  gfClient.init(address);
```

### Registering a Schema

To register a new schema, you can use the `register` function provided by the BAS SDK. This function takes an object with the following properties:

- `schema`: The schema string that defines the structure of the data to be attested.
- `resolverAddress`: The Ethereum address of the resolver responsible for managing the schema.
- `revocable`: A boolean value indicating whether attestations created with this schema can be revoked.

Here’s an example of how to register a new schema:

```jsx
import { SchemaRegistry } from "@bnb-attestation-service/bas-sdk";

const schemaRegistryContractAddress = "0xYourSchemaRegistryContractAddress";
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

schemaRegistry.connect(signer);

const schema = "uint256 eventId, uint8 voteIndex";
const resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";// Sepolia 0.26
const revocable = true;

const transaction = await schemaRegistry.register({
  schema,
  resolverAddress,
  revocable,
});

// Optional: Wait for transaction to be validated
await transaction.wait();

```

Once you have registered a schema, you can utilize its UID to generate attestations that adhere to the designated structure.

### Getting Schema Information

To obtain the schema information for a particular schema UID, you can utilize the `getSchema` function provided by the BAS SDK. Here is an example:

```jsx
import { SchemaRegistry } from "@bnb-attestation-service/bas-sdk";

const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";// Sepolia 0.26
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
schemaRegistry.connect(provider);

const schemaUID = "0xYourSchemaUID";

const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

console.log(schemaRecord);

// Example Output
{
  uid: '0xYourSchemaUID',
  schema: 'bytes32 proposalId, bool vote',
  resolver: '0xResolverAddress',
  revocable: true
}

```

In the output, you will receive an object that includes the schema UID, the schema string, the resolver address, and a boolean flag indicating if the schema can be revoked or not.

### Getting an Attestation

The `getAttestation` function enables you to fetch an onchain attestation for a specific UID. This function will return an attestation object that includes details about the attestation, such as the schema, recipient, attester, and other relevant information.

### Usage

```jsx
import { BAS } from "@bnb-attestation-service/bas-sdk";

const bas = new BAS(BASContractAddress);
bas.connect(provider);

const uid = "0xff08bbf3d3e6e0992fc70ab9b9370416be59e87897c3d42b20549901d2cccc3e";

const attestation = await bas.getAttestation(uid);

console.log(attestation);

```

### Output

The `getAttestation` function confidently returns an attestation object with the following properties:

- `uid`: The unique identifier of the attestation.
- `schema`: The schema identifier associated with the attestation.
- `refUID`: The reference UID of the attestation, if any.
- `time`: The Unix timestamp when the attestation was created.
- `expirationTime`: The Unix timestamp when the attestation expires (0 for no expiration).
- `revocationTime`: The Unix timestamp when the attestation was revoked, if applicable.
- `recipient`: The Ethereum address of the recipient of the attestation.
- `attester`: The Ethereum address of the attester who created the attestation.
- `revocable`: A boolean indicating whether the attestation is revocable or not.
- `data`: The attestation data in bytes format.

Example output:

```jsx
{
    uid: '0x5134f511e0533f997e569dac711952dde21daf14b316f3cce23835defc82c065',
    schema: '0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a',
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    time: 1671219600,
    expirationTime: 0,
    revocationTime: 1671219636,
    recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
    attester: '0x1e3de6aE412cA218FD2ae3379750388D414532dc',
    revocable: true,
    data: '0x0000000000000000000000000000000000000000000000000000000000000000'
}

```

### Creating On-chain Attestations

The `attest` function enables you to confidently create an on-chain attestation for a specific schema. This powerful function accepts an object with the following properties:

- `schema`: The unique identifier (UID) of the schema for which the attestation is being created.
- `data`: An object that contains the following properties:
    - `recipient`: The Ethereum address of the attestation recipient.
    - `expirationTime`: A Unix timestamp that represents the expiration time of the attestation. You can set it to `0` for no expiration.
    - `revocable`: A boolean value that indicates whether the attestation can be revoked or not.
    - `refUID`: (Optional) The UID of a referenced attestation. If there is no reference, use `ZERO_BYTES32`.
    - `data`: The encoded data for the attestation, which should be generated using the `SchemaEncoder` class.

This function gracefully returns a Promise that resolves to the UID of the newly created attestation.

```jsx
import { BAS, SchemaEncoder } from "@bnb-attestation-service/bas-sdk";

const bas = new BAS(BASContractAddress);
bas.connect(signer);

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
const encodedData = schemaEncoder.encodeData([
  { name: "eventId", value: 1, type: "uint256" },
  { name: "voteIndex", value: 1, type: "uint8" },
]);

const schemaUID = "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995";

const tx = await bas.attest({
  schema: schemaUID,
  data: {
    recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
    expirationTime: 0,
    revocable: true,// Be aware that if your schema is not revocable, this MUST be false
    data: encodedData,
  },
});

const newAttestationUID = await tx.wait();

console.log("New attestation UID:", newAttestationUID);

```

### Creating Off-chain Attestations without Saving to GreenField

To generate an off-chain attestation, you can confidently utilize the `signOffchainAttestation` function offered by the Off-chain class in the BAS SDK. Here's an example:

```jsx
import { SchemaEncoder } from "@bnb-attestation-service/bas-sdk";

const offchain = await bas.getOffchain();

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
const encodedData = schemaEncoder.encodeData([
  { name: "eventId", value: 1, type: "uint256" },
  { name: "voteIndex", value: 1, type: "uint8" },
]);

// Signer is an ethers.js Signer instance
const signer = new ethers.Wallet(privateKey, provider);

const offchainAttestation = await offchain.signOffchainAttestation({
  recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
// Unix timestamp of when attestation expires. (0 for no expiration)
  expirationTime: 0,
// Unix timestamp of current time
  time: 1671219636,
  revocable: true,// Be aware that if your schema is not revocable, this MUST be false
  version: 1,
  nonce: 0,
  schema: "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
  refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
  data: encodedData,
}, signer);

```

This function will confidently generate an attestation object off-chain, which will be signed and contain the UID, signature, and attestation data. You can confidently share this object with the intended recipient or confidently store it for future use.

### Creating Off-chain Attestation and Saving to GreenField

To generate an off-chain attestation and save the result to GreenField Storage, you can confidently utilize the `attestOffChain` function offered by the BAS SDK. Here's an example:

```jsx
  const offchain = await bas.getOffchain();

  // Use wallet or client to ensure the chain is BNB
  // [WARN]: should call an async function
  await shouldSwitchNetwork(chains[1].id); // BNB chainId

  // Attest offchain
  const attestation = await attestOffChain({
    schemaStr: attestParams.schemaStr,
    schemaUID: attestParams.schemaUID,
    data: attestParams.data,
    recipient: attestParams.recipient,
    revocable: attestParams.revocable,
  });

  const attestationUID = attestation.uid;

  // Use wallet or client to ensure the chain is Greenfield Chain
  await shouldSwitchNetwork(chains[0].id);
  const provider = await connector?.getProvider({ chainId: chains[0].id });

  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  // Encode the attestation object into blob to store on the Greenfield Storage
  const str = JSON.stringify(attestation);
  const bytes = new TextEncoder().encode(str);
  const blob = new Blob([bytes], {
    type: "application/json;charset=utf-8",
  });

  let res;
  try {
    // Use GreenField SDK to store the attestation
    res = await gfClient.createObject(
      provider,
      new File([blob], `${attestParams.schemaUID}.${attestationUID}`),
      attestParams.isPrivate || true
    );
  } catch (err: any) {
    console.log(err);
    alert(err.message);
  }

```

This function will generate an attestation object off-chain. The attestation object will be signed and will contain the UID, signature, and attestation data. Similar to the previous function, you can also save it to greenfield storage and set the access according to your preferences.

### Revoking On-chain Attestations

Revoking an attestation can only happen from the issuer address.

```jsx
const transaction = await bas.revoke({
  schema: "0x85500e806cf1e74844d51a20a6d893fe1ed6f6b0738b50e43d774827d08eca61",
  data: { uid: "0x6776de8122c352b4d671003e58ca112aedb99f34c629a1d1fe3b332504e2943a" }
});

// Optional: Wait for transaction to be validated
await transaction.wait();

```

### Revoking Off-chain Attestations

To revoke an off-chain attestation, you can use the `revokeOffchain` function provided by the BAS SDK. Here’s an example:

```jsx
import { BAS } from "@bnb-attestation-service/bas-sdk";

const bas = new BAS(BASContractAddress);
bas.connect(provider);

const data = ethers.utils.formatBytes32String('0x6776de8122c352b4d671003e58ca112aedb99f34c629a1d1fe3b332504e2943a');

const transaction = await bas.revokeOffchain(data);

// Optional: Wait for transaction to be validated
await transaction.wait();

```

### Get offchain Attestation from GreenField

If the off-chain attestation is stored in the GreenField Storage, you can conveniently get it from the storage. Here's an example:

```js
const provider = await connector?.getProvider();
const res = await gfClient.getObject(
  provider,
  `${schemaUID}.${attestationUID}`
);

const data = JSON.parse(String(res));
```

### Change Visibility of Attestations on GreenField

You can use `updateObjectVisibility` to change the visibility of the attestations on GreenField. Here's an example:

```js
gfClient.updateObjectVisibility(
  objectName,
  isPublic
    ? VisibilityType.VISIBILITY_TYPE_PUBLIC_READ
    : VisibilityType.VISIBILITY_TYPE_PRIVATE,
  _address
);
```

### Verify an Off-chain Attestation

To verify an off-chain attestation, you can utilize the `verifyOffchainAttestationSignature` function provided by the BAS SDK. Here's an example:

```jsx
import { OFFCHAIN_ATTESTATION_VERSION, Offchain, PartialTypedDataConfig } from "@bnb-attestation-service/bas-sdk";

const attestation = {
// your offchain attestation
  sig: {
    domain: {
      name: "BAS Attestation",
      version: "0.26",
      chainId: 1,
      verifyingContract: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    },
    primaryType: "Attest",
    types: {
      Attest: [],
    },
    signature: {
      r: "",
      s: "",
      v: 28,
    },
    uid: "0x5134f511e0533f997e569dac711952dde21daf14b316f3cce23835defc82c065",
    message: {
      version: 1,
      schema: "0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a",
      refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
      time: 1671219600,
      expirationTime: 0,
      recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
      attester: "0x1e3de6aE412cA218FD2ae3379750388D414532dc",
      revocable: true,
      data: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
  },
  signer: "0x1e3de6aE412cA218FD2ae3379750388D414532dc",
};

const BAS_CONFIG: PartialTypedDataConfig = {
  address: attestation.sig.domain.verifyingContract,
  version: attestation.sig.domain.version,
  chainId: attestation.sig.domain.chainId,
};
const offchain = new Offchain(BAS_CONFIG, OFFCHAIN_ATTESTATION_VERSION);
const isValidAttestation = offchain.verifyOffchainAttestationSignature(
  attestation.signer,
  attestation.sig
);

```

### Naming a Schema and Describe a Schema on the BAScan

You have the option to create a new attestation on the schema named "Name a Schema" in order to give it a name. And also you can create a new attestation on the schema named “SCHEMA DESCRIPTION” in order to add a description to the schema.

```jsx
const namingSchema = async (schameUID: string, name: string) => {
    return attestOnChain({
      schemaStr: "bytes32 schemaId,string name",
      schemaUID: NamingSchemaUID,
      data: [
        { name: "schemaId", value: schameUID, type: "bytes32" },
        { name: "name", value: name, type: "string" },
      ],
      recipient: "0x0000000000000000000000000000000000000000",
      revocable: true,
    });
  };

  const describeSchema = async (schameUID: string, description: string) => {
    return attestOnChain({
      schemaStr: "bytes32 schemaId,string description",
      schemaUID: DescribeSchameUID,
      data: [
        { name: "schemaId", value: schameUID, type: "bytes32" },
        { name: "description", value: description, type: "string" },
      ],
      recipient: "0x0000000000000000000000000000000000000000",
      revocable: true,
    });
  };
```