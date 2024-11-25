"use client"

import { AccountContext } from "@/contexts/account"
import { ServerContext } from "@/contexts/server";
import { shortText } from "@/helpers";
import { useContext, useEffect, useState } from "react"
import { FaRegCopy } from "react-icons/fa6";
import { CopyToClipboard } from 'react-copy-to-clipboard'

const AccountContainerOLD = () => {

    const [balance, setBalance] = useState(0)

    const { isConnected, address, user, getBalance } = useContext(AccountContext)

    useEffect(() => {
        isConnected && getBalance().then(setBalance)
    }, [isConnected])

    return (
        <>
            <div className="w-full max-w-lg mx-auto bg-neutral-800 rounded-lg p-4 py-8 mt-[20px] min-h-[250px] flex flex-col">

                {!isConnected && (
                    <div className="m-auto text-center">
                        You are not logged in. Please log in and try again.
                    </div>
                )}

                {isConnected && (
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex flex-col">
                            <h2 className="text-sm mb-2 text-neutral-400">Email address</h2>
                            <input disabled value={user && user.email} className="h-[40px] px-2 rounded bg-neutral-700 " />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm mb-2 text-neutral-400">Wallet address</h2>
                            <input disabled value={address || "0x0"} className="h-[40px] px-2 rounded bg-neutral-700 " />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm mb-2 text-neutral-400">Network</h2>
                            <input disabled value={"SUI Testnet"} className="h-[40px] px-2 rounded bg-neutral-700 " />
                        </div>
                        <div className="text-xs text-neutral-400 mt-2">
                            Balance: {(balance).toLocaleString()} SUI
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

const WalletItem = ({ icon, name, status, address }) => {
    return (
        <div className="border my-2 border-neutral-600 p-6 px-4 text-sm flex flex-row">
            <div className="w-[20px]">
                <img src={icon} />
            </div>
            <div className="w-[150px] mx-2 my-auto text-sm">
                {name}
            </div>
            <div className="my-auto text-xs flex-grow text-center italic">
                ({status})
            </div>
            <div className=" my-auto text-right ">
                <CopyToClipboard
                    text={address}
                >
                    <span className="cursor-pointer hover:opacity-60 flex flex-row justify-end">
                        <FaRegCopy className="mr-1" />
                        {shortText(address, 8, -6)}
                    </span>
                </CopyToClipboard>


            </div>

        </div>
    )
}

const AccountContainer = () => {

    const { user, logout } = useContext(AccountContext)
    const { shared_addresses } = useContext(ServerContext)


    return (
        <div className="w-full max-w-5xl mx-auto p-4 mt-2 grid grid-cols-7 gap-3">

            <div className="col-span-7 md:col-span-3 ">
                <div className="border border-neutral-600 p-6 px-4">
                    <h2 className="font-semibold text-2xl ">Account</h2>
                    <p className="mt-4 mb-0 text-neutral-400">Email:</p>
                    <p>
                        {user && user.email}
                    </p>
                    <div className="mt-6 mb-0">
                        <button onClick={() => logout()}
                            className={`inline-flex  justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-span-7 md:col-span-4 ">

                <div className="border border-neutral-600 p-6 px-4">
                    <div className="flex flex-row mb-4">
                        <h2 className="font-semibold text-2xl ">Automation Signer Addresses</h2>
                        {/* <div className="ml-auto">
                            <button onClick={() => alert("hello...")}
                                className={`inline-flex  justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>
                                <FiPlusCircle size={18} className="my-auto pb-[3px]" />
                                Add Wallet
                            </button>
                        </div>  */}
                    </div>

                    {shared_addresses && (
                        <>
                            <WalletItem
                                icon={"/sui-logo.svg"}
                                name={"Sui L1"}
                                status={"Stopped"}
                                address={shared_addresses["sui"]}
                            />
                            <WalletItem
                                icon={"/aptos-logo.png"}
                                name={"Aptos L1"}
                                status={"Stopped"}
                                address={shared_addresses["aptos"]}
                            />
                            <WalletItem
                                icon={"/crypto-com-logo.svg"}
                                name={"Cronos EVM, zkEVM"}
                                status={"Running"}
                                address={shared_addresses["evm"]}
                            />
                        </>
                    )}

                    <p className="mt-6 text-sm text-neutral-400">
                        The above addresses need to be whitelisted on your smart contract to enable automated operations and workflows with the system
                    </p>
                </div>

            </div>
        </div>
    )

}

export default AccountContainer