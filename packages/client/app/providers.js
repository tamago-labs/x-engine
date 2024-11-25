'use client';

import { useEffect, useState } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { EnokiFlowProvider } from '@mysten/enoki/react';
import {
    createNetworkConfig,
    SuiClientProvider,
    WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from "@mysten/sui/client";
import "@mysten/dapp-kit/dist/index.css";
import Loading from '@/components/loading';
import AccountProvider from "../contexts/account"
import ServerProvider from "../contexts/server"
import { registerStashedWallet } from "@mysten/zksend";

const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
});

const sessionStorageAdapter = {
    getItem: async (key) => {
        return sessionStorage.getItem(key);
    },
    setItem: async (key, value) => {
        sessionStorage.setItem(key, value);
    },
    removeItem: async (key) => {
        sessionStorage.removeItem(key);
    },
};

registerStashedWallet("Breaking the Ice - Community Vote", {});

const queryClient = new QueryClient();

export function Providers({ children }) {


    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        AOS.init({
            once: true,
        });
    }, []);

    useEffect(() => {

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

    });

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <SuiClientProvider
                    networks={networkConfig}
                    defaultNetwork={"testnet"}
                >
                    <ServerProvider>
                        <WalletProvider
                            autoConnect
                            stashedWallet={{
                                name: "Breaking the Ice - Community Vote",
                            }}
                            storage={sessionStorageAdapter}
                        >
                            <EnokiFlowProvider apiKey={process.env.ENOKI_API_KEY}>
                                <AccountProvider>
                                    {/* screen loader  */}
                                    {showLoader && (
                                        <Loading />
                                    )}
                                    {children}
                                </AccountProvider>
                            </EnokiFlowProvider>
                        </WalletProvider>
                    </ServerProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </>
    );
}