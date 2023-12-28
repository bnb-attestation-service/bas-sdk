/* eslint-disable @next/next/no-sync-scripts */
"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiConfig, createConfig } from "wagmi";
import { Chain, configureChains } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { greenFieldChain } from "./app.env";
import Script from "next/script";

const { publicClient } = configureChains(
  [
    // mainnet,
    greenFieldChain,
    bscTestnet,
  ],
  [publicProvider()]
);

const config = createConfig({
  connectors: [],
  autoConnect: true,
  publicClient,
});
const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/browser/umd/index.js"></script>
        <script
          id="file-handler-wasm-path"
          dangerouslySetInnerHTML={{
            __html: `window.__PUBLIC_FILE_HANDLE_WASM_PATH__ = 'https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/node/file-handle.wasm'`,
          }}
        ></script>
      </head>
      <WagmiConfig config={config}>
        <body className={inter.className}>{children}</body>
      </WagmiConfig>
    </html>
  );
}