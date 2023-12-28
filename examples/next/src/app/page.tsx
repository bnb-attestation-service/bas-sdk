"use client";
import { useBAS } from "./usehooks/useBAS";
import { useState } from "react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { bscTestnet } from "wagmi/chains";
import { useAccount, useConnect } from "wagmi";
import Link from "next/link";

export default function Home() {
  const { attestOnChain, registerSchema, attestOffChainWithGreenField } =
    useBAS();
  const { isConnected } = useAccount({
    onConnect: (data) => console.log("connected", data),
    onDisconnect: () => console.log("disconnected"),
  });
  const { connect } = useConnect();
  const [schemaUID, setSchemaUID] = useState<null | string>(null);
  const [attestationUID, setAttestationUID] = useState<null | string>(null);
  const [offchainAttestationUID, setOffchainAttestationUID] = useState<
    null | string
  >(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button> </button>
        <button
          onClick={() => {
            connect({
              connector: new MetaMaskConnector({ chains: [bscTestnet] }),
            });
          }}
          color="primary"
        >
          Connect
        </button>
      </div>
      {isProcessing && <div>Processing...</div>}
      {isConnected && !isProcessing && (
        <div className="flex justify-around w-[100%]">
          <button
            className="bg-[#FFA163] hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              setIsProcessing(true);
              const uid = await registerSchema(
                // attestParams, need to change this to match the fields of the schema
                [{ type: "string", field: "greetingBSC2", isArray: false }],
                "0x0000000000000000000000000000000000000000",
                true
              );
              console.log(uid);

              setIsProcessing(false);
              if (uid) {
                setSchemaUID(uid);
              }
            }}
          >
            Register a Schema
          </button>
          <button
            className="bg-[#FFA163] hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              setIsProcessing(true);
              const uid = await attestOnChain({
                // attestParams, need to change this to match the fields of the schema
                schemaStr: "string greetingBSC1",
                schemaUID:
                  "0xcb86ea930c2fde4952fe64237575b62903a353e4724174fd272d2fc4053165dc",
                data: [
                  {
                    name: "greetingBSC1",
                    type: "string",
                    value: "hello, bsc",
                  },
                ],
                recipient: "0x0000000000000000000000000000000000000000",
                revocable: false,
              });
              console.log(uid);

              setIsProcessing(false);
              if (uid) {
                setAttestationUID(uid);
              }
            }}
          >
            Make an Online Attestation
          </button>
          <button
            className="bg-[#FFA163] hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              setIsProcessing(true);
              const res = await attestOffChainWithGreenField({
                // attestParams, need to change this to match the fields of the schema
                schemaStr: "string greetingBSC1",
                schemaUID:
                  "0xcb86ea930c2fde4952fe64237575b62903a353e4724174fd272d2fc4053165dc",
                data: [
                  {
                    name: "greetingBSC1",
                    type: "string",
                    value: "hello, bsc",
                  },
                ],
                recipient: "0x0000000000000000000000000000000000000000",
                revocable: false,
              });
              console.log(res);

              setIsProcessing(false);
              if (res !== "notfound" && res.uid) {
                setOffchainAttestationUID(res.uid);
              }
            }}
          >
            Make an Offline Attestation
          </button>
        </div>
      )}
      <div>
        {schemaUID && (
          <div>
            Schema UID:{" "}
            <Link
              className="text-[#FFA163]"
              href={`https://test.bascan.io/schema/${schemaUID}`}
              target="_blank"
            >
              {schemaUID}
            </Link>
          </div>
        )}
        {attestationUID && (
          <div>
            Attestation UID:{" "}
            <Link
              className="text-[#FFA163]"
              href={`https://test.bascan.io/attestation/${attestationUID}`}
              target="_blank"
            >
              {attestationUID}
            </Link>
          </div>
        )}
        {offchainAttestationUID && (
          <div>
            Attestation UID:{" "}
            <Link
              className="text-[#FFA163]"
              href={`https://test.bascan.io/attestation/${offchainAttestationUID}`}
              target="_blank"
            >
              {offchainAttestationUID}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
