import { AuthContext } from "@/hooks/useAuth"
import { useContext } from "react"
import { ArrowRight, Grid, LogIn, LogOut, Play, Plus, Settings } from "react-feather"
import Link from "next/link"
import { ModalContext } from "@/hooks/useModal"
import ResultRow from "./ResultRow"


const Home = () => {

    const { showModal, isLoggedIn, logOut } = useContext(AuthContext)

    const { openSettings, openStart } = useContext(ModalContext)

    return (
        <div className="bg-neutral-900 min-h-screen flex  pt-[29px]">

            <div className="my-auto w-full max-w-2xl text-white mx-auto">

                <h4 className="py-1">
                    Quick Actions
                </h4>
                <div className="grid grid-cols-3 py-1 gap-3">
                    {!isLoggedIn && (
                        <div>
                            <button onClick={showModal} className="bg-neutral-800 px-6 py-3.5 flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                <LogIn className="mr-[10px]" />
                                Login
                            </button>
                        </div>
                    )}
                    <div>
                        <Link href="/add">
                            <button className="bg-neutral-800 px-6 py-3.5  flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                <Plus className="mr-[10px]" />
                                Add
                            </button>
                        </Link>
                    </div>
                    {/* <div>
                        <Link href="/integration">
                            <button className="bg-neutral-800 px-6 py-3.5  flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                <Grid className="mr-[10px]" />
                                Integration
                            </button>
                        </Link>
                    </div> */}
                    <div>
                        <button onClick={openStart} className="bg-neutral-800 px-6 py-3.5 flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                            <Play className="mr-[10px]" />
                            Start
                        </button>
                    </div>
                    {isLoggedIn && (
                        <div>
                            <button onClick={logOut} className="bg-neutral-800 px-6 py-3.5 flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                <LogOut className="mr-[10px]" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>



                <h4 className="py-1 mt-2">
                    Recent Results
                </h4>

                {/* <ResultRow/>
                <ResultRow/>
                <ResultRow/> */}

                <div className="  flex mt-2  rounded-lg  w-full h-[160px] border border-neutral-600  ">
                    <div className="m-auto  text-center w-[60%]">
                        No recent results. You may use predefined context and example files to start the process.
                    </div>
                </div>

                <div className='flex-grow border-neutral-600 border-t  p-4 mt-[40px] flex  '>
                    <div className='my-2'>
                        {/* <li>Welcome to X-Engine, an AI code review tool for Move contracts.</li> */}
                        <li>Welcome to X-Engine, an AI automation tool for analyzing any readable data to trigger smart contracts and streamline any dApp.</li>
                        <li>You are using a public beta version which may contain bugs or incomplete features.</li>
                        <li>New users receive 30 credits and 10 credits are added upon the first login each day.</li>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Home