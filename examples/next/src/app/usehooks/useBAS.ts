"use client";

import { BAS, SchemaEncoder, SchemaRegistry } from "tbas-sdk";
import { useCallback, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useMemo } from "react";
import { useWalletClient } from "wagmi";
import { GREEN_CHAIN_ID, GRPC_URL, greenFieldChain } from "../app.env";

const base64ToHex = (base64: string) => {
  const raw = atob(base64);
  let result = "0x";
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : "0" + hex;
  }
  return result;
};

enum VisibilityType {
  VISIBILITY_TYPE_UNSPECIFIED = 0,
  VISIBILITY_TYPE_PUBLIC_READ = 1,
  VISIBILITY_TYPE_PRIVATE = 2,
  /** VISIBILITY_TYPE_INHERIT - If the bucket Visibility is inherit, it's finally set to private. If the object Visibility is inherit, it's the same as bucket. */
  VISIBILITY_TYPE_INHERIT = 3,
  UNRECOGNIZED = -1,
}

const { chains } = configureChains(
  [
    // mainnet,
    greenFieldChain,
    bscTestnet,
  ],
  [publicProvider()]
);

export function walletClientToSigner(walletClient: any) {
  const { account, transport } = walletClient;
  const network = {
    chainId: bscTestnet.id,
    name: bscTestnet.name,
    ensAddress: "0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD",
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}

export const EASContractAddress = "0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD"; //  BNB BAS
export const SchemaRegistryContractAddress =
  "0x08C8b8417313fF130526862f90cd822B55002D72";
const BNBResolverAddress = "0x0000000000000000000000000000000000000000"; // BNB Default Resolver
const NamingSchemaUID =
  "0x44d562ac1d7cd77e232978687fea027ace48f719cf1d58c7888e509663bb87fc";
const DescribeSchameUID =
  "0x21cbc60aac46ba22125ff85dd01882ebe6e87eb4fc46628589931ccbef9b8c94";
const DefaultRefUID =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

// Initialize the sdk with the address of the EAS Schema contract address
const bas = new BAS(EASContractAddress, GRPC_URL, GREEN_CHAIN_ID);

type AttestParams = {
  schemaStr: string;
  schemaUID: string;
  data: any;
  recipient: string;
  revocable: boolean;
  expirationTime?: bigint;
  isPrivate?: boolean;
  refUID?: string;
};

const zeroAddressIfInvalid = (addr: any) => {
  if (!addr || typeof addr !== "string" || addr.length === 0) {
    return "0x0000000000000000000000000000000000000000";
  }
  return addr;
};

const formatValue = ({ value, type }: any) => {
  if (type === "boolean" || type === "string") {
    return [value];
  }
  if (type === "uint256") {
    return [value.toString()];
  }
  return [value?.toString?.() || ""];
};

interface AttestationCreationParams extends AttestParams {
  onChain: boolean;
  withGreenField: boolean;
}

export type Schema = Array<{
  type: string;
  field: string;
  isArray: boolean;
}>;

export const useBAS = () => {
  const signer = useEthersSigner({ chainId: bscTestnet.id });
  useSwitchNetwork();
  const { connector, address } = useAccount();

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { greenFieldClient } = bas;

  useEffect(() => {
    if (signer) {
      //@ts-ignore
      bas.connect(signer);
    }
    if (address) {
      greenFieldClient.init(address, GREEN_CHAIN_ID);
    }
  }, [signer, address]);

  const registerSchema = async (
    schema: Schema,
    resolverAddress: string = BNBResolverAddress,
    revocable: boolean
  ) => {
    if (chain?.id !== bscTestnet.id) {
      return;
    }
    const schemaRegistry = new SchemaRegistry(SchemaRegistryContractAddress);
    const schemaPlain = schema
      .map((s) => `${s.type}${s.isArray ? "[]" : ""} ${s.field}`)
      .join(",");

    // @ts-ignore
    schemaRegistry.connect(signer);

    const transaction = await schemaRegistry.register({
      schema: schemaPlain,
      resolverAddress,
      revocable,
    });

    console.log("transaction", transaction);

    // Optional: Wait for transaction to be validated
    const newSchemaUID = await transaction.wait();

    return newSchemaUID;
  };

  const shouldSwitchNetwork = useCallback(
    (chainId: number) => {
      if (!switchNetworkAsync) alert("switchNetworkAsync is undefined");
      if (!chain || chain.id === chainId) return;
      return switchNetworkAsync?.(chainId).catch((err: Error) => {
        console.log(err);
        alert(err?.message);
        throw new Error("Failed to switch network");
      });
    },
    [switchNetworkAsync, chain]
  );

  const attestOffChain = async ({
    schemaStr,
    schemaUID,
    data,
    recipient,
    revocable,
    expirationTime,
    refUID,
  }: AttestParams) => {
    const offchain = await bas.getOffchain();
    // Data Example
    // [
    //   { name: "eventId", value: 1, type: "uint256" },
    //   { name: "voteIndex", value: 1, type: "uint8" },
    // ]

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(schemaStr);
    const encodedData = schemaEncoder.encodeData(data);

    // Signer is an ethers.js Signer instance
    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        recipient: zeroAddressIfInvalid(recipient),
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: expirationTime || BigInt(0),
        // Unix timestamp of current time
        time: BigInt(Math.ceil(Date.now() / 1000 || 0)),
        revocable, // Be aware that if your schema is not revocable, this MUST be false
        version: 1,
        nonce: BigInt(0),
        schema: schemaUID,
        refUID: refUID || DefaultRefUID,
        data: encodedData,
      },
      //@ts-ignore
      signer
    );

    console.log(offchainAttestation);
    return offchainAttestation;
  };

  const attestOnChain = async ({
    schemaStr,
    schemaUID,
    data,
    recipient,
    revocable,
    expirationTime,
    refUID,
  }: AttestParams) => {
    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(schemaStr);

    const encodedData = schemaEncoder.encodeData(data);

    const tx = await bas.attest({
      schema: schemaUID,
      data: {
        recipient: zeroAddressIfInvalid(recipient),
        expirationTime,
        revocable, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
        refUID,
      },
    });

    const newAttestationUID = await tx.wait();

    return newAttestationUID;
  };

  const revokeAttestation = async (
    attestationUID: string,
    onChain: boolean,
    schemaUID?: string
  ) => {
    let tx;
    if (!onChain) {
      tx = await bas.revokeOffchain(attestationUID);
    } else {
      if (!schemaUID) return;
      tx = await bas.revoke({
        schema: schemaUID,
        data: { uid: attestationUID },
      });
    }
    return tx.wait();
  };

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

  const attestOffChainWithGreenField = async (attestParams: AttestParams) => {
    await shouldSwitchNetwork(chains[1].id);

    const attestation = await attestOffChain({
      schemaStr: attestParams.schemaStr,
      schemaUID: attestParams.schemaUID,
      data: attestParams.data,
      recipient: attestParams.recipient,
      revocable: attestParams.revocable,
    });
    console.log({ attestation });

    const attestationUID = attestation.uid;

    await shouldSwitchNetwork(chains[0].id);
    const provider = await connector?.getProvider({ chainId: 5600 });

    //@ts-ignore
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    const str = JSON.stringify(attestation);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8",
    });

    let res;
    try {
      res = await greenFieldClient.createObject(
        provider,
        new File([blob], `${attestParams.schemaUID}.${attestationUID}`),
        attestParams.isPrivate
      );
    } catch (err: any) {
      if (err.statusCode === 404) {
        return "notfound";
      }
      console.log(err);
      alert(err.message);
    }

    return { ...attestation, objectInfo: res };
  };

  const attest = async ({
    onChain,
    withGreenField,
    ...otherParams
  }: AttestationCreationParams) => {
    if (onChain) {
      const uid = await attestOnChain({
        schemaStr: "string p,string tick,uint256 amt,uint256 nonce",
        schemaUID:
          "0xc4506c516a1ff973a2dc2fcac98650631e34e98cd2b88659ca2549b7e2fd6bf7",
        data: [
          {
            name: "p",
            type: "string",
            value: "1",
            disabled: false,
          },
          {
            name: "tick",
            type: "string",
            value: "2",
            disabled: false,
          },
          {
            name: "amt",
            type: "uint256",
            value: "3",
            disabled: false,
          },
          {
            name: "nonce",
            type: "uint256",
            value: "4",
            disabled: false,
          },
        ],
        recipient: "0x0000000000000000000000000000000000000000",
        revocable: false,
      });
      return { uid };
    }

    if (withGreenField) {
      return attestOffChainWithGreenField(otherParams);
    }

    return attestOffChain(otherParams);
  };

  const getOffChainAttestation = async (
    schemaUID: string,
    attestationUID: string
  ) => {
    const provider = await connector?.getProvider({ chainId: 5600 });
    const res = await greenFieldClient.getObject(
      provider,
      `${schemaUID}.${attestationUID}`
    );

    let data = null;
    try {
      data = JSON.parse(String(res));
    } catch (err) {
      console.log(err, res);
    }

    return data;
  };

  const decodeHexData = (dataRaw: string, schemaStr: string) => {
    const schemaEncoder = new SchemaEncoder(schemaStr);
    let res = schemaEncoder.decodeData(dataRaw);
    console.log({ res });
    res = res.map((e: any) => ({
      ...e,
      value: formatValue(e.value),
      // typeof e.value.type === "boolean" || typeof e.value.type === "string"
      //   ? [e.value.value]
      //   : [e.value.value?.toString?.() || ""],
    }));
    console.log({ res });

    return res;
  };

  const changeVisibility = async (
    objectName: string,
    isPublic: boolean,
    _address: string
  ) => {
    await shouldSwitchNetwork(chains[0].id);

    const res = await greenFieldClient.updateObjectVisibility(
      objectName,
      isPublic
        ? VisibilityType.VISIBILITY_TYPE_PUBLIC_READ
        : VisibilityType.VISIBILITY_TYPE_PRIVATE,
      _address
    );
    console.log("update res", res);
    return res;
  };

  const createBASBuckect = async () => {
    if (!address) return;
    await shouldSwitchNetwork(chains[0].id);
    const provider = await connector?.getProvider({ chainId: 5600 });

    const res = await greenFieldClient.createBucket(provider);
    console.log("update res", res);
    return res;
  };

  return {
    registerSchema,
    attestOffChain,
    attestOnChain,
    revokeAttestation,
    namingSchema,
    describeSchema,
    attestOffChainWithGreenField,
    attest,
    getOffChainAttestation,
    changeVisibility,
    shouldSwitchNetwork,
    createBASBuckect,
    decodeHexData,
  };
};
