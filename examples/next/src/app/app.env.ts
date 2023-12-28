export const GREENFIELD_RPC_URL =
  '"https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org"';
// export const GREEN_CHAIN_ID = "greenfield_5600-1";
export const GREEN_CHAIN_ID = "5600";
export const GRPC_URL =
  "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org";

export const greenFieldChain = {
  id: 5600,
  network: "greenfield",
  rpcUrls: {
    default: {
      http: [GREENFIELD_RPC_URL],
    },
    public: {
      http: [GREENFIELD_RPC_URL],
    },
  },
  name: "greenfield",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  iconUrl:
    "https://github.com/wagmi-dev/wagmi/assets/5653652/44446c8c-5c72-4e89-b8eb-3042ef618eed",
};
