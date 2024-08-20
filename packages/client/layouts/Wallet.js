import { useState, useEffect, useContext } from "react"


import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import '@suiet/wallet-kit/style.css';

import { MartianWallet } from "@martianwallet/aptos-wallet-adapter"
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { LayoutContext } from "@/hooks/useLayout";

import { WalletProvider } from '@suiet/wallet-kit';

import { ethers } from "ethers";
import { Web3ReactProvider } from '@web3-react/core';

const getLibrary = (provider) => {
    const library = new ethers.BrowserProvider(provider)
    library.pollingInterval = 12000
    return library
}

const wallets = [
    new BitgetWallet(),
    new FewchaWallet(),
    new MartianWallet(),
    new MSafeWalletAdapter(),
    new PontemWallet(),
    new TrustWallet(),
    new OKXWallet(),
];


const WalletLayout = ({ children }) => {

    const { network, allNetworks } = useContext(LayoutContext)

    return (
        <>
            {network === allNetworks.APTOS && (
                <AptosWalletAdapterProvider plugins={wallets} optInWallets={["Petra"]} autoConnect={true}>
                    {children}
                </AptosWalletAdapterProvider>
            )}

            {network === allNetworks.SUI && (
                <WalletProvider>
                    {children}
                </WalletProvider>
            )}

            {network === allNetworks.ETH && (
                <Web3ReactProvider getLibrary={getLibrary}>
                    {children}
                </Web3ReactProvider>
            )}

        </>
    )

}

export default WalletLayout