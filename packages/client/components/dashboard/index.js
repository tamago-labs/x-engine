"use client"

import { AccountContext } from "@/contexts/account"
import { ServerContext } from "@/contexts/server"
import { useContext, useEffect, useState } from "react"

import Link from "next/link"
import TemplateModal from "@/modals/template"


const MODAL = {
    NONE: 0,
    TEMPLATE: 1
}


const DashboardContainerOLD = () => {

    const [modal, setModal] = useState(MODAL.NONE)

    const [isActive, setActive] = useState(false)

    const { user } = useContext(AccountContext)
    const { checkActive } = useContext(ServerContext)

    useEffect(() => {
        checkActive().then(setActive)
    }, [])


    return (
        <>

            <TemplateModal
                visible={ modal === MODAL.TEMPLATE }
                close={ () => setModal(MODAL.NONE)}
            />

            <div className="flex flex-col">

                <div data-aos="fade-up" data-aos-duration="1000" className="text-center mt-[40px] text-2xl font-semibold">
                    Welcome, {user ? user.email : "Anonymous"}
                </div>

                <div className="mt-[20px] mx-auto w-full max-w-md flex flex-col space-y-4">


                    <Link href="/workbench" className="py-4 px-4 border text-center border-neutral-600 rounded-full hover:border-neutral-300">
                        Create New Task
                    </Link>

                    <button onClick={() => setModal(MODAL.TEMPLATE)} className="py-4 px-4 border text-center border-neutral-600 rounded-full hover:border-neutral-300">
                        Clone from Templates
                    </button>

                    <Link href="/workbench"  className="py-4 px-4 border text-center border-neutral-600 rounded-full hover:border-neutral-300">
                        Load Saved Tasks
                    </Link>

                </div>

                <div className='mx-auto flex flex-row mt-[20px] text-xs'>
                    <div className="relative mt-auto mb-auto mr-1.5 ml-0.5">
                        <div className={`w-2 h-2 ${isActive ? "bg-lime-600" : "bg-yellow-400"} rounded-full`}></div>
                    </div>

                    {isActive && (
                        <>
                            Server connected
                        </>
                    )}
                    {!isActive && (
                        <>
                            Can't connect to the server
                        </>
                    )}
                </div>


            </div>

        </>
    )
}

const DashboardContainer = () => {
    return (
        <div>
            TBD
        </div>
    )
}

export default DashboardContainer