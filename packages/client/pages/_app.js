import "@/styles/globals.css";

import AccountProvider from "../hooks/useAccount"

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { MartianWallet } from "@martianwallet/aptos-wallet-adapter"
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";

const wallets = [
  new BitgetWallet(),
  new FewchaWallet(),
  new MartianWallet(),
  new MSafeWalletAdapter(),
  new PontemWallet(),
  new TrustWallet(),
  new OKXWallet(),
];

export default function App({ Component, pageProps }) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} optInWallets={["Petra"]} autoConnect={true}>
      <AccountProvider>
        <Component {...pageProps} />
      </AccountProvider>
    </AptosWalletAdapterProvider> 
  )
}
