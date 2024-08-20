import { LayoutContext } from "@/hooks/useLayout"
import { useContext, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import {
    ConnectButton,
    useAccountBalance,
    useWallet as useWalletSui,
    SuiChainId,
    ErrorCode,
    formatSUI
} from "@suiet/wallet-kit"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { ModalContext } from "@/hooks/useModal";
import useInactiveListener from "@/hooks/useInactiveListener";
import useEagerConnect from "@/hooks/useEagerConnect";

import { Connectors } from "../constants"

const ConnectButtonAptos = () => {
    return (
        <>
            <WalletSelector />
            <style>
                {
                    `
                        .wallet-button { 
                            width: 200px;
                            z-index: 1;
                            background: white;
                            color: #222;
                            font-family: monospace, monospace;
                            font-size: 14px;
                            border-radius: 4px;
                        } 
                    `
                }
            </style>
        </>
    )
}

const ConnectButtonEVM = () => {

    const context = useWeb3React()

    const { account, activate, deactivate, error, chainId } = context

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState()

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect()

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    const onConnect = () => {
        setActivatingConnector(Connectors[0].connector)
        activate(Connectors[0].connector)
    }

    return (
        <>
            {!account ?
                <>
                    <button onClick={() => onConnect()} class={`bg-white text-center text-black mr-1.5 w-[200px] rounded `}>
                        Connect Wallet
                    </button>
                </>
                :
                <>
                    <button onClick={() => deactivate()} class={`bg-white text-center text-black mr-1.5 w-[200px] rounded `}>
                        Disconnect
                    </button>
                </>

            }
        </>
    )
}

const ConnectButtonSui = () => {

    const wallet = useWalletSui()
    const { account, connected } = wallet
    const address = account && account?.address
    const isTestnet = connected && account && account.chains && account.chains[0] === "sui:testnet" ? true : false


    return (
        <>
            {wallet && wallet.connected ? (
                <button onClick={() => {
                    wallet.disconnect()
                }} type="button" className="bg-white text-center text-black mr-1.5 w-[200px] rounded">
                    Disconnect
                </button>
            ) :
                <ConnectButton style={{ width: "200px", borderRadius: "4px", fontSize :"14px", paddingTop:"5px", paddingBottom:"5px", backgroundColor:"white", color:"black" , fontWeight : "normal", fontFamily:"unset"}}>
                    Connect Wallet
                </ConnectButton>
            }
        </>
    )
}

const WalletHeader = () => {

    const { openNetwork } = useContext(ModalContext)
    const { network, allNetworks, selectNetwork } = useContext(LayoutContext)

    useEffect(() => {
        if (localStorage.getItem("xreviewNetwork")) {
            selectNetwork(localStorage.getItem("xreviewNetwork") || "Aptos")
        }
    }, [])

    return (
        <>
            <div className='ml-auto text-sm p-1 mr-1 font-mono flex flex-row'>
                <button onClick={() => openNetwork()} class={`bg-white text-center text-black mr-1.5 w-[140px] rounded `}>
                    {network}
                </button>

                {network === allNetworks.APTOS && (
                    <ConnectButtonAptos />
                )}

                {network === allNetworks.SUI && (
                    <ConnectButtonSui />
                )}

                {network === allNetworks.ETH && (
                    <ConnectButtonEVM />
                )}

            </div>
        </>
    )
}

export default WalletHeader