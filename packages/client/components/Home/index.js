import { AuthContext } from "@/hooks/useAuth"
import { useContext } from "react"
import { ArrowRight, FileText, Grid, LogIn, LogOut, Play, Plus, Settings } from "react-feather"
import Link from "next/link"
import { ModalContext } from "@/hooks/useModal"
import ResultRow from "./ResultRow"


const Home = () => {
 
    const { openSettings, openStart } = useContext(ModalContext)

    return (
        <div className="bg-neutral-900 min-h-screen flex  pt-[29px]">

            <div className="my-auto w-full max-w-2xl text-white mx-auto">

                <h4 className="py-1">
                    Quick Actions
                </h4>
                <div className="grid grid-cols-3 py-1 gap-3"> 
                    <div>
                        <Link href="/editor">
                            <button className="bg-neutral-800 px-6 py-3.5  flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                <Plus className="mr-[10px]" />
                                Add File
                            </button>
                        </Link>
                    </div> 
                    <div>
                        <button onClick={openStart} className="bg-neutral-800 px-6 py-3.5 flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                            <Play className="mr-[10px]" />
                            Run Test
                        </button>
                    </div>
                    <div>
                        <Link href="/report">
                            <button className="bg-neutral-800 px-6 py-3.5  flex flex-row justify-center w-full rounded-full border border-neutral-600 hover:border-white">
                                <FileText className="mr-[10px]" />
                                Check Report
                            </button>
                        </Link>
                    </div>
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
 

            </div>

        </div>
    )
}

export default Home