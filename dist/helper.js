// import { hashMessage } from 'viem';
import { hashMessage } from "viem";
export const selectSp = async (client) => {
    const finalSps = await getSps(client);
    const selectIndex = Math.floor(Math.random() * finalSps.length);
    const secondarySpAddresses = [
        ...finalSps.slice(0, selectIndex),
        ...finalSps.slice(selectIndex + 1),
    ].map((item) => item.operatorAddress);
    const selectSpInfo = {
        //@ts-ignore
        id: finalSps[selectIndex].id,
        endpoint: finalSps[selectIndex].endpoint,
        primarySpAddress: finalSps[selectIndex]?.operatorAddress,
        sealAddress: finalSps[selectIndex].sealAddress,
        secondarySpAddresses,
    };
    return selectSpInfo;
};
export const getSps = async (client) => {
    const sps = await client.sp.getStorageProviders();
    const finalSps = (sps ?? []).filter((v) => v.endpoint.includes("nodereal"));
    return finalSps;
};
export const getAllSps = async (client) => {
    const sps = await getSps(client);
    return sps.map((sp) => {
        return {
            address: sp.operatorAddress,
            endpoint: sp.endpoint,
            name: sp.description?.moniker,
        };
    });
};
/**
 * generate off-chain auth key pair and upload public key to sp
 */
export const getOffchainAuthKeys = async (address, provider, client, _chainId) => {
    if (_chainId === null) {
        throw new Error("chainId is null");
    }
    const storageResStr = localStorage.getItem(address);
    const chainId = parseInt(_chainId.match(/\d+/)?.[0] || "0", 10);
    if (storageResStr) {
        const storageRes = JSON.parse(storageResStr);
        if (storageRes.expirationTime < Date.now()) {
            alert("Your auth key has expired, please generate a new one");
            localStorage.removeItem(address);
            return;
        }
        return storageRes;
    }
    const allSps = await getAllSps(client);
    const offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload({
        sps: allSps,
        chainId,
        expirationMs: 5 * 24 * 60 * 60 * 1000,
        domain: window.location.origin,
        address,
    }, provider);
    const { code, body: offChainData } = offchainAuthRes;
    if (code !== 0 || !offChainData) {
        throw offchainAuthRes;
    }
    localStorage.setItem(address, JSON.stringify(offChainData));
    return offChainData;
};
// hash string to hex
export const encodeAddrToBucketName = (addr) => {
    return `bas-${hashMessage(addr).substring(2, 42)}`;
};
//# sourceMappingURL=helper.js.map