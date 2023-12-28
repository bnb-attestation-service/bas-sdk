import { IReturnOffChainAuthKeyPairAndUpload } from "@bnb-chain/greenfield-js-sdk";
import { Client } from "@bnb-chain/greenfield-js-sdk";
export declare const selectSp: (client: Client) => Promise<{
    id: any;
    endpoint: string;
    primarySpAddress: string;
    sealAddress: string;
    secondarySpAddresses: string[];
}>;
export declare const getSps: (client: Client) => Promise<import("@bnb-chain/greenfield-cosmos-types/greenfield/sp/types").StorageProvider[]>;
export declare const getAllSps: (client: Client) => Promise<{
    address: string;
    endpoint: string;
    name: string | undefined;
}[]>;
/**
 * generate off-chain auth key pair and upload public key to sp
 */
export declare const getOffchainAuthKeys: (address: string, provider: any, client: Client, _chainId: string | null) => Promise<IReturnOffChainAuthKeyPairAndUpload | undefined>;
export declare const encodeAddrToBucketName: (addr: string) => string;
