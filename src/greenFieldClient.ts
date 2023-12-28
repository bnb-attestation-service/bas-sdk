import { Client, PermissionTypes } from "@bnb-chain/greenfield-js-sdk";
import { getOffchainAuthKeys, encodeAddrToBucketName } from "./helper";
import { StorageProvider } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/types';

export const getSps = async (client: Client): Promise<StorageProvider[] >=> {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v: any) =>
    v.endpoint.includes("nodereal")
  );

  return finalSps;
};

export const getAllSps = async (client: Client) => {
  const sps = await getSps(client);

  return sps.map((sp) => {
    return {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
      name: sp.description?.moniker,
    };
  });
};

export const selectSp = async (client: Client) => {
  const finalSps = await getSps(client);

  const selectIndex = Math.floor(Math.random() * finalSps.length);

  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    //@ts-ignore
    id: finalSps[selectIndex].id || 0,
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };

  return selectSpInfo;
};

export enum VisibilityType {
  VISIBILITY_TYPE_UNSPECIFIED = 0,
  VISIBILITY_TYPE_PUBLIC_READ = 1,
  VISIBILITY_TYPE_PRIVATE = 2,
  /** VISIBILITY_TYPE_INHERIT - If the bucket Visibility is inherit, it's finally set to private. If the object Visibility is inherit, it's the same as bucket. */
  VISIBILITY_TYPE_INHERIT = 3,
  UNRECOGNIZED = -1,
}

const BUCKET_NAME = "bas";

export class GreenFieldClient {
  client: Client;
  chainId: string | null = null;
  address: string | null = null;

  constructor(url: string, chainId: string) {
    this.client = Client.create(url, chainId, {
      zkCryptoUrl:
        "https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.3/dist/node/zk-crypto.wasm",
    });
  }

  init(address: string, chainId: string) {
    console.log("init", address, chainId);
    this.address = address;
    this.chainId = chainId;
  }

  async createBucket(provider: any, bucketName = BUCKET_NAME) {
    if (!this.address || !this.chainId) return;

    const spInfo = await selectSp(this.client);
    console.log("spInfo", spInfo);
    console.log("====>", this.address, provider, this.client, this.chainId);

    // const provider = await connector?.getProvider();
    const offChainData = await getOffchainAuthKeys(
      this.address,
      provider,
      this.client,
      this.chainId
    );
    if (!offChainData) {
      alert("No offchain, please create offchain pairs first");
      return;
    }

    let res;
    try {
      const createBucketTx = await this.client.bucket.createBucket(
        {
          bucketName,
          creator: this.address,
          visibility: "VISIBILITY_TYPE_PUBLIC_READ",
          chargedReadQuota: "0",
          spInfo: {
            primarySpAddress: spInfo.primarySpAddress,
          },
          paymentAddress: this.address,
        },
        {
          // type: 'ECDSA',
          // privateKey: ACCOUNT_PRIVATEKEY,
          type: "EDDSA",
          domain: window.location.origin,
          seed: offChainData.seedString,
          address: this.address,
        }
      );

      console.log({ createBucketTx });

      const simulateInfo = await createBucketTx.simulate({
        denom: "BNB",
      });

      console.log("simulateInfo", simulateInfo);

      res = await createBucketTx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || "5000000000",
        payer: this.address,
        granter: "",
      });
    } catch (err) {
      console.log(typeof err);
      if (err instanceof Error) {
        alert(err.message);
      }
      if (err && typeof err === "object") {
        alert(JSON.stringify(err));
      }
    }

    if (res?.code === 0) {
      return res;
    } else {
      console.log("GF Error!", res);
      return null;
    }
  }

  async mirrorBucket(provider: any, bucketInfo: any) {
    if (!this.address || !this.chainId) return;

    const spInfo = await selectSp(this.client);
    console.log("spInfo", spInfo);

    // const provider = await connector?.getProvider();
    const offChainData = await getOffchainAuthKeys(
      this.address,
      provider,
      this.client,
      this.chainId
    );
    if (!offChainData) {
      alert("No offchain, please create offchain pairs first");
      return;
    }

    const createBucketTx = await this.client.crosschain.mirrorBucket({
      id: bucketInfo.id,
      operator: this.address,
    });

    const simulateInfo = await createBucketTx.simulate({
      denom: "BNB",
    });

    console.log("simulateInfo", simulateInfo);

    const res = await createBucketTx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || "5000000000",
      payer: this.address,
      granter: "",
    });

    if (res.code === 0) {
      return res;
    } else {
      console.log("GF Error!", res);
      return null;
    }
  }

  async createObject(provider: any, file: File, isPrivate: boolean = true) {
    console.log("started");
    console.log(this.address, this.chainId);
    if (!this.address || !file || !this.chainId) {
      alert("Please select a file or address");
      return;
    }

    const offChainData = await getOffchainAuthKeys(
      this.address,
      provider,
      this.client,
      this.chainId
    );
    if (!offChainData) {
      console.log("No offchain, please create offchain pairs first");
      alert("No offchain, please create offchain pairs first");
      return;
    }

    const fileBytes = await file.arrayBuffer();
    const hashResult = await (window as any).FileHandle.getCheckSums(
      new Uint8Array(fileBytes)
    );
    const { contentLength, expectCheckSums } = hashResult;
    console.log(hashResult);

    console.log("offChainData", offChainData);
    console.log("hashResult", hashResult);

    const tx = await this.client.object.createObject(
      {
        bucketName: encodeAddrToBucketName(this.address),
        objectName: file.name,
        creator: this.address,
        visibility: isPrivate
          ? "VISIBILITY_TYPE_PRIVATE"
          : "VISIBILITY_TYPE_PUBLIC_READ",
        fileType: "json",
        redundancyType: "REDUNDANCY_EC_TYPE",
        contentLength: contentLength,
        expectCheckSums: JSON.parse(expectCheckSums),
      },
      {
        type: "EDDSA",
        domain: window.location.origin,
        seed: offChainData.seedString,
        address: this.address,
      }
    );

    console.log({ tx });

    const simulateInfo = await tx.simulate({
      denom: "BNB",
    });

    console.log(simulateInfo);

    const { transactionHash } = await tx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateInfo.gasLimit),
      gasPrice: simulateInfo.gasPrice,
      payer: this.address,
      granter: "",
      signTypedDataCallback: async (addr: string, message: string) => {
        return await provider?.request({
          method: "eth_signTypedData_v4",
          params: [addr, message],
        });
      },
    });

    const uploadRes = await this.client.object.uploadObject(
      {
        bucketName: encodeAddrToBucketName(this.address),
        objectName: file.name,
        body: file,
        txnHash: transactionHash,
      },
      {
        type: "EDDSA",
        domain: window.location.origin,
        seed: offChainData.seedString,
        address: this.address,
      }
    );

    return uploadRes;
  }

  async mirrorObject(provider: any, objectInfo: any) {
    async () => {
      if (!this.address) return;

      const mirrorGroupTx = await this.client.crosschain.mirrorObject({
        id: objectInfo.id,
        operator: this.address,
      });

      const simulateInfo = await mirrorGroupTx.simulate({
        denom: "BNB",
      });

      console.log(simulateInfo);

      const res = await mirrorGroupTx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: this.address,
        granter: "",
        signTypedDataCallback: async (addr: string, message: string) => {
          return await provider?.request({
            method: "eth_signTypedData_v4",
            params: [addr, message],
          });
        },
      });

      if (res.code === 0) {
        alert("mirror group success");
      }

      return res;
    };
  }

  async deleteObject(objectInfo: any) {
    if (!this.address) return;

    const deleteObjectTx = await this.client.object.deleteObject({
      bucketName: BUCKET_NAME,
      objectName: objectInfo.name,
      operator: this.address,
    });

    const simulateInfo = await deleteObjectTx.simulate({
      denom: "BNB",
    });

    console.log("simulateInfo", simulateInfo);

    const res = await deleteObjectTx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || "5000000000",
      payer: this.address,
      granter: "",
    });

    console.log("res", res);
    if (res.code === 0) {
      alert("success");
    }
  }

  async getObjectInfo(
    // provider: any,
    objectName: string,
    bucketName: string = BUCKET_NAME
  ) {
    if (!this.address) return;
    const sp = await selectSp(this.client);

    const objInfo = await this.client.object.getObjectMeta({
      bucketName,
      objectName,
      endpoint: sp.endpoint,
    });

    console.log(objInfo);

    return objInfo;
  }

  async getObject(
    // provider: any,
    provider: any,
    objectName: string,
  ) {
    if (!this.address) return;
    const offChainData = await getOffchainAuthKeys(
      this.address,
      provider,
      this.client,
      this.chainId
    );
    if (!offChainData) {
      console.log("No offchain, please create offchain pairs first");
      alert("No offchain, please create offchain pairs first");
      return;
    }

    const res = await this.client.object.getObject(
      {
        bucketName: encodeAddrToBucketName(this.address),
        objectName,
      },
      {
        type: "EDDSA",
        address: this.address,
        domain: window.location.origin,
        seed: offChainData.seedString,
      }
    );

    if (res.code !== 0) {
      return null;
    }

    return res.body?.text();
  }

  async updateObjectVisibility(
    objectName: string,
    visibility: VisibilityType,
    address: string,
  ) {
    if (!this.address && !address) return;

    const tx = await this.client.object.updateObjectInfo({
      bucketName: encodeAddrToBucketName(this.address || address),
      objectName,
      operator: this.address || address,
      visibility,
    });

    const simulateInfo = await tx.simulate({
      denom: "BNB",
    });

    console.log("simulateInfo", simulateInfo);

    const res = await tx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || "5000000000",
      payer: this.address || address,
      granter: "",
    });

    console.log("res", res);
  }

  async updateObjectPolicy(
    objectName: string,
    effect: PermissionTypes.Effect,
    principalType: PermissionTypes.PrincipalType,
    principalValue: string,
  ) {
    if (!this.address) return;

    const statement: PermissionTypes.Statement = {
      effect,
      actions: [PermissionTypes.ActionType.ACTION_GET_OBJECT],
      resources: [],
    };

    const tx = await this.client.object.putObjectPolicy(
      encodeAddrToBucketName(this.address),
      objectName,
      {
        operator: this.address,
        statements: [statement],
        principal: {
          type: principalType,
          value: principalValue,
        },
      }
    );

    const simulateInfo = await tx.simulate({
      denom: "BNB",
    });

    console.log("simulateInfo", simulateInfo);

    const res = await tx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || "5000000000",
      payer: this.address,
      granter: "",
    });

    return res;
  }
}
