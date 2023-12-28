import { Client, PermissionTypes } from "@bnb-chain/greenfield-js-sdk";
import { StorageProvider } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/types';
export declare const getSps: (client: Client) => Promise<StorageProvider[]>;
export declare const getAllSps: (client: Client) => Promise<{
    address: string;
    endpoint: string;
    name: string | undefined;
}[]>;
export declare const selectSp: (client: Client) => Promise<{
    id: any;
    endpoint: string;
    primarySpAddress: string;
    sealAddress: string;
    secondarySpAddresses: string[];
}>;
export declare enum VisibilityType {
    VISIBILITY_TYPE_UNSPECIFIED = 0,
    VISIBILITY_TYPE_PUBLIC_READ = 1,
    VISIBILITY_TYPE_PRIVATE = 2,
    /** VISIBILITY_TYPE_INHERIT - If the bucket Visibility is inherit, it's finally set to private. If the object Visibility is inherit, it's the same as bucket. */
    VISIBILITY_TYPE_INHERIT = 3,
    UNRECOGNIZED = -1
}
export declare class GreenFieldClient {
    client: Client;
    chainId: string | null;
    address: string | null;
    constructor(url: string, chainId: string);
    init(address: string, chainId: string): void;
    createBucket(provider: any, bucketName?: string): Promise<import("@cosmjs/stargate").DeliverTxResponse | null | undefined>;
    mirrorBucket(provider: any, bucketInfo: any): Promise<import("@cosmjs/stargate").DeliverTxResponse | null | undefined>;
    createObject(provider: any, file: File, isPrivate?: boolean): Promise<import("@bnb-chain/greenfield-js-sdk").SpResponse<null> | undefined>;
    mirrorObject(provider: any, objectInfo: any): Promise<void>;
    deleteObject(objectInfo: any): Promise<void>;
    getObjectInfo(objectName: string, bucketName?: string): Promise<import("@bnb-chain/greenfield-js-sdk").SpResponse<GetObjectMetaResponse> | undefined>;
    getObject(provider: any, objectName: string): Promise<string | null | undefined>;
    updateObjectVisibility(objectName: string, visibility: VisibilityType, address: string): Promise<void>;
    updateObjectPolicy(objectName: string, effect: PermissionTypes.Effect, principalType: PermissionTypes.PrincipalType, principalValue: string): Promise<import("@cosmjs/stargate").DeliverTxResponse | undefined>;
}
