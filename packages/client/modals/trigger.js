import { useCallback, useEffect, useState } from "react"
import BaseModal from "./base"
import { useConnectWallet } from '@web3-onboard/react'
import Example from "../data/example.json"
import { Puff } from 'react-loading-icons'
import axios from "axios";
import { ethers } from "ethers";


const TriggerModal = ({
    visible,
    close
}) => {

    const [value, setValue] = useState("1")

    const [contractAddress, setContractAddress] = useState(Example[0].address)

    const [step, setStep] = useState(1)
    const [abi, setAbi] = useState(undefined)

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

    const onNext = useCallback(async () => {

        if (step === 1) {
            setStep(2)
            fetchInfo()
        }

        if (step === 2) {

            const ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')

            const signer = await ethersProvider.getSigner()

            const contract = new ethers.Contract(
                contractAddress,
                abi,
                signer
            );
 


            const tx = await contract.updateValue(
                value
            );

        }

    }, [step, value, contractAddress, wallet, abi])

    const onBack = useCallback(() => {
        setStep(1)
        setAbi(undefined)
    }, [])

    const fetchInfo = useCallback(async () => {

        setAbi(undefined)

        const { data } = await axios.post("/api/fetch_abi", {
            contractAddress
        })

        setTimeout(() => {
            setAbi(data.abi)
        }, 3000)

    }, [contractAddress])


    return (
        <BaseModal
            visible={visible}
            close={close}
            title="Trigger Smart Contract"
            maxWidth="max-w-2xl"
        >

            <div className="grid grid-cols-5 gap-2 mt-2">

                <div class="col-span-5 flex">
                    <p className="text-xs font-medium text-gray-300">
                        Select the network where your smart contract is deployed. You may need to connect the respective wallet if required.
                    </p>
                </div>

                <div className="col-span-5 py-2">

                    {!wallet && (
                        <div className="text-yellow-400 text-sm font-semibold py-2 pt-0 text-center">
                            Wallet isn't connected
                        </div>
                    )}

                    <div className="border border-neutral-600 rounded-lg flex flex-col py-2 px-4">

                        <div className="mx-auto w-full max-w-sm">
                            <ol className="flex my-2 items-center w-full justify-between text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                                <li className={`flex items-center ${step === 1 && "font-semibold text-white"}`}>
                                    <span className="me-2">1</span>
                                    Contract Info
                                </li>

                                <li className={`flex items-center ${step === 2 && "font-semibold text-white"}`}>
                                    <span className="me-2">2</span>
                                    Update Values
                                </li>
                            </ol>
                        </div>


                        {step === 1 && (
                            <div className="px-4 py-4 pb-2">
                                <p className="text-xs font-medium text-gray-300 mb-2">
                                    Contract Address
                                </p>
                                <input value={contractAddress} onChange={(e) => {
                                    setContractAddress(e.target.value)
                                }} className="text-sm px-2 py-2 rounded bg-neutral-700 w-full" />
                                <p className="text-xs mt-4 font-medium text-gray-300 mb-2">
                                    Network
                                </p>
                                <input value={"Cronos zkEVM Testnet"} disabled={true} className="text-sm px-2 py-2 rounded bg-neutral-700 w-full" />
                                <p className="text-xs font-medium mt-2 text-center text-gray-300">
                                    Currently support Cronos zkEVM Testnet
                                </p>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="px-4 py-4 pb-2">

                                {!abi && (
                                    <div className="h-[150px] flex flex-col">
                                        <Puff className="mx-auto mt-auto" />
                                        <p className="text-xs font-medium text-center mt-4 text-gray-300 mx-auto mb-auto">
                                            Fetching information using Crypto.com AI Agent
                                        </p>
                                    </div>
                                )}

                                {abi && (
                                    <div className="grid grid-cols-3">
                                        <div className="flex flex-col mr-2">
                                            <p className="text-xs mt-4 font-medium text-gray-300 mb-2">
                                                Function
                                            </p>
                                            <select id="categories" value={"updateValue"} class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                {abi.filter(item => item.inputs.length > 0).map((item, index) => {
                                                    return (
                                                        <option key={index} value={"updateValue"}> updateValue </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className="p-2 col-span-2">
                                            <p className="text-xs font-medium text-gray-300 mb-2">
                                                Value
                                            </p>
                                            <input value={value} onChange={(e) => {
                                                setValue(e.target.value)
                                            }} className="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}



                        <div className="mt-2 mb-2 flex flex-row max-w-sm mx-auto space-x-2">

                            <button onClick={onBack} disabled={step === 1} className="justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5  font-semibold text-gray-900 shadow-sm flex flex-row ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">
                                Back
                            </button>
                            <button onClick={onNext} className="justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5  font-semibold text-gray-900 shadow-sm flex flex-row ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </BaseModal >
    )
}

export default TriggerModal