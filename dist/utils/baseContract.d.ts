import { Hex, Hash } from "viem";
export interface CallContractParams {
    functionName: string;
    args: unknown[];
    value?: bigint;
}
export declare class BaseContract {
    private abi;
    private contractAddress;
    private publicClient;
    private walletClient?;
    private chain;
    constructor(contractABI: any, contractAddress: Hex, privateKey?: Hex);
    read(params: CallContractParams): Promise<bigint | unknown>;
    write(params: CallContractParams): Promise<Hash>;
}
