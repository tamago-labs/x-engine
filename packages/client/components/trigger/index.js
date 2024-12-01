"use client"


import Markdown from 'react-markdown'
import { ServerContext } from "@/contexts/server"
import { shortText } from "@/helpers"
import { useContext, useEffect, useState } from "react"
import { ArrowRight } from "react-feather"
import { AccountContext } from "@/contexts/account"
import { X } from "react-feather"
import Content from "./content"
import TriggerModal from '@/modals/trigger'
import { useConnectWallet } from '@web3-onboard/react'
import { Suspense } from 'react'

const Wrapper = () => {
    return (
        <Suspense>
            <TriggerContainer/>
        </Suspense>
    )
}


const TriggerContainer = () => {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

    const [selected, setSelect] = useState()
    const [reports, setReports] = useState([])
    const [modal, setModal] = useState(false)

    const { user, isConnected } = useContext(AccountContext)
    const { getReport } = useContext(ServerContext)

    useEffect(() => {

        if (user) {
            const { email } = user
            getReport(email).then(setReports)
        }

    }, [user])

    console.log("selected ", selected)

    return (
        <>

            <TriggerModal
                visible={modal}
                close={() => setModal(false)}
            />

            <div className="grid grid-cols-10  h-full">

                <div className="col-span-2 bg-neutral-900  border-r border-neutral-600 flex flex-col">

                    <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                        <h4 className="m-auto text-gray-400 font-semibold uppercase text-sm tracking-wider">
                            reports
                        </h4>

                    </div>

                    <div className="grid grid-cols-5 gap-2 px-2 mt-4">
                        <div class="col-span-5 flex">
                            <p className="text-xs font-medium text-gray-300">
                                Access all reports associated with your account.
                            </p>
                        </div>

                        {!isConnected && (
                            <div class="col-span-5 flex mt-2 px-1">
                                <div className="  flex   rounded-xl  w-full py-6  border border-neutral-600  ">
                                    <div className="m-auto text-sm text-center w-[60%]">
                                        You are not logged in
                                    </div>
                                </div>
                            </div>
                        )}

                        {reports.length === 0 && (
                            <div class="col-span-5 flex mt-2 px-1">
                                <div className="  flex   rounded-xl  w-full py-6  border border-neutral-600  ">
                                    <div className="m-auto text-sm text-center w-[60%]">
                                        Empty
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="col-span-5">
                            {reports.map((item, index) => {
                                return (
                                    <div onClick={() => {
                                        setSelect({
                                            ...item
                                        })
                                    }} className="px-2 py-4 group border rounded my-2 flex flex-row cursor-pointer" key={index}>
                                        <p className="text-xs font-medium my-auto text-gray-300">
                                            {item.title}
                                        </p>

                                        <ArrowRight className="ml-auto transition group-hover:scale-110" size={14} />
                                    </div>
                                )
                            })}

                        </div>

                        <div class="col-span-5 flex">
                            <p className="text-xs font-medium text-gray-300">
                                These reports contain outputs and can be used to trigger and update smart contract values through various plugins provided.
                            </p>
                        </div>

                        <div className='border-b  col-span-5 border-neutral-600 py-4 pt-0'>

                        </div>

                        <div className='mt-4  col-span-5 px-1'>
                            <button disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())} className="w-full justify-center gap-x-1.5 rounded bg-white px-6 py-1.5  font-semibold text-gray-900 shadow-sm flex flex-row ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">
                                {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect EVM Wallet'}
                            </button>
                        </div>

                    </div>
                </div>

                <div className={`col-span-8 bg-neutral-900 `}>

                    <Content selected={selected} setSelect={setSelect} openModal={() => setModal(true)} />

                </div>

            </div>
        </>
    )

}

export default Wrapper