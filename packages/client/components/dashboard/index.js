"use client"

import { AccountContext } from "@/contexts/account"
import { ServerContext } from "@/contexts/server"
import { useContext, useEffect, useState } from "react"
import { ArrowRight, FileText, Grid, LogIn, LogOut, Play, Plus, Settings } from "react-feather"
import { GrTrigger } from "react-icons/gr";
import { LoginButton } from "../loginPanel"

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

    contexts
    return (
        <>

            <TemplateModal
                visible={modal === MODAL.TEMPLATE}
                close={() => setModal(MODAL.NONE)}
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

                    <Link href="/workbench" className="py-4 px-4 border text-center border-neutral-600 rounded-full hover:border-neutral-300">
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

    const { isConnected, user, logout } = useContext(AccountContext)
    const { checkSession, session, contexts } = useContext(ServerContext)

    useEffect(() => {

        if (isConnected && user) {
            const { email } = user
            checkSession(email)
        }

    }, [isConnected, user])

    const jobs = []

    console.log("session: ", session)
    console.log("contexts: ", contexts)

    return (
        <>

            <div className=" mx-auto w-full max-w-5xl p-4 mt-2 grid grid-cols-7 gap-3">

                <div className="col-span-4 flex">


                    {!isConnected && (
                        <div className="mx-4">
                            <div className="border border-neutral-600 w-full  mx-4 rounded-xl px-6 py-6">
                                <h2 className="text-xl w-[300px]  font-semibold mt-6 ">Welcome to Tamago Labs!</h2>
                                <p className="text-sm py-2">Automate smart contract operations with AI for endless use cases</p>
                                <div className='my-4 border-neutral-600 border-t pt-4 flex text-sm  px-0 sm:px-2 text-gray-100 '>
                                    {/* <div className="w-full max-w-[420px] mx-auto">
                                    <li>Now featuring gas optimization and vulnerability detection with AI for Move contracts. </li>
                                    <li>Reviews are processed in batches to help reduce costs.</li>
                                    <li>We're still in the alpha version, which may contain bugs and incomplete features</li>
                                    <li>Currently free to use. Each user receives 30© upon first login and 10© daily</li>
                                </div> */}
                                </div>

                                <div className="py-2 mt-2">
                                    <LoginButton />
                                </div>
                            </div>
                            <div className="ml-10 mt-4 mr-2 py-2">
                                <div className="w-full text-sm  mx-auto">
                                    {/* <li>Now featuring gas optimization and vulnerability detection with AI for Move contracts. </li>
                                    <li>Reviews are processed in batches to help reduce costs.</li> */}
                                    <li>We're still in the alpha version, which may contain bugs and incomplete features</li>
                                    <li>Currently free to use. Each user receives 30© upon first login and 10© daily</li>
                                </div>
                            </div>
                        </div>

                    )}

                    {isConnected && (
                        <div className="w-full flex mx-4 flex-col">
                            <h4 className="py-1 my-2">
                                Your Account
                            </h4>
                            <div className="border rounded-xl  w-full border-neutral-600 p-6 px-4">
                                {/* <h2 className="font-semibold text-2xl ">Account</h2> */}
                                <div className="grid grid-cols-2">
                                    <div>
                                        <p className="  text-neutral-400">Email:</p>
                                        <p>
                                            {user && user.email}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="  text-neutral-400">Credits:</p>
                                        <p>
                                            {session && session.credits}©
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <h4 className="py-1 mt-2">
                                Processing Jobs
                            </h4>

                            {jobs.length === 0 && (
                                <div className="  flex mt-2  rounded-xl  w-full h-[160px] border border-neutral-600  ">
                                    <div className="m-auto text-sm text-center w-[60%]">
                                        No active jobs in the system
                                    </div>
                                </div>
                            )}


                            {/* {jobs.map((job, index) => {
                                return (
                                    <div key={index}>
                                        <ResultRow item={job} />
                                    </div>
                                )
                            })} */}

                            <div className="mt-5 mb-1 space-x-3">
                                <Link href="/trigger">
                                    <button
                                        className={`inline-flex  justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>
                                        View Results
                                    </button>
                                </Link>

                                <button onClick={() => logout()}
                                    className={`inline-flex  justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>
                                    Logout
                                </button>
                            </div>

                            <div className="ml-2 mt-4 mr-2 py-2">
                                <div className="w-full text-sm  mx-auto">
                                    {/* <li>Now featuring gas optimization and vulnerability detection with AI for Move contracts. </li>
                                    <li>Reviews are processed in batches to help reduce costs.</li> */}
                                    <li>We're still in the alpha version, which may contain bugs and incomplete features</li>
                                    <li>Currently free to use. Each user receives 30© upon first login and 10© daily</li>
                                </div>
                            </div>

                        </div>
                    )} 
                </div>

                <div className="col-span-3 flex">

                    <div className="flex my-auto w-full flex-col space-y-4">
                        <div>
                            <Link href="/input">
                                <button className="bg-neutral-800 px-6 py-3.5  flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                    <Plus className="mr-[10px]" />
                                    Add Task
                                </button>
                            </Link>
                        </div>
                        <div>
                            <button onClick={() => alert("hello...")} className="bg-neutral-800 px-6 py-3.5 flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                <Play className="mr-[10px]" />
                                Submit Task
                            </button>
                        </div>
                        <div>
                            <Link href="/trigger">
                                <button className="bg-neutral-800 px-6 py-3.5  flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                    <GrTrigger size={22} className="mr-[10px]" />
                                    Update Contract
                                </button>
                            </Link>
                        </div>
                        <div className="text-center text-xs py-1">
                            Currently, <Link href="/context" className="underline">{ contexts && (Object.keys(contexts)).length }</Link> contexts are available
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default DashboardContainer