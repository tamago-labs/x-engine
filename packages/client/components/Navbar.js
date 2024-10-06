import { useRouter } from "next/router"
import Link from "next/link"
import { MessageSquare, FileText, Server, Home, Settings, GitHub, Code, Book, BookOpen, List, Edit, HelpCircle, CheckCircle, CheckSquare, Package, Inbox, Activity, Feather, Clock, Table, Plus, PlusSquare, Database, Calendar, Grid, LogIn, LogOut, Flag } from "react-feather"
import { useContext } from "react"
import { GrVulnerability } from "react-icons/gr";
import { RiGasStationFill } from "react-icons/ri";
import { ModalContext } from "@/hooks/useModal"
import { AuthContext } from "@/hooks/useAuth"

const Navbar = () => {

    const router = useRouter()

    const { openHelp } = useContext(ModalContext)

    return (
        <nav className="h-full pt-[29px] flex flex-col">
            <ul className="space-y-2  ">
                <li className={`${router.pathname === "/" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname === "/" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <Home size={24} />
                            </div>
                        </div>
                    </Link>
                </li>
                <li className={`${router.pathname === "/editor" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/editor">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname === "/editor" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <PlusSquare size={24} />
                            </div>
                        </div>
                    </Link>
                </li>

                <li className={`${router.pathname === "/detector" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/detector">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname === "/detector" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <Flag size={24} />
                            </div>
                        </div>
                    </Link>
                </li>

                <li className={`${router.pathname === "/report" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/report">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname === "/report" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <FileText size={24} />
                            </div>
                        </div>
                    </Link>
                </li>

                <li className={`  border-transparent border-l-4 `}>
                    <div onClick={openHelp} className="mx-auto py-3 justify-between p-2 cursor-pointer">
                        <div className={`flex items-center justify-center opacity-60 hover:opacity-100`}>
                            <HelpCircle size={24} />
                        </div>
                    </div>
                </li>

            </ul>
            <ul className=" h-full flex flex-col">
                <li className="mt-auto mx-auto">
                    <Link target="_blank" href="https://github.com/tamago-labs/x-engine">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer border-transparent border-l-4">
                            <div className={`flex items-center justify-center opacity-60  `}>
                                <GitHub size={24} />
                            </div>
                        </div>
                    </Link>
                </li> 
            </ul>
        </nav>
    )
}

export default Navbar