import { useRouter } from "next/router"
import Link from "next/link"
import { MessageSquare, FileText, Server, Home, Settings, GitHub, Code, Book, BookOpen, List, Edit, HelpCircle, CheckCircle, CheckSquare, Package, Inbox, Activity, Feather, Clock, Table } from "react-feather"
import { useContext } from "react"
import { ModalContext } from "@/hooks/useModal"

const Navbar = () => {

    const router = useRouter()

    const { openSettings } = useContext(ModalContext)

    return (
        <nav className="h-full pt-[29px] flex flex-col">
            <ul className="space-y-2  ">
                <li className={`${router.pathname === "/" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname === "/" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <Edit size={24} />
                            </div>
                        </div>
                    </Link>
                </li>
                <li className={`${router.pathname.includes("report") ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href={`/report`}>
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname.includes("report") ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <Book size={24} />
                            </div>
                        </div>
                    </Link>
                </li>
                {/* <li className={`${router.pathname === "/activity" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/activity">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname === "/activity" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <Clock size={24} />
                            </div>
                        </div>
                    </Link>
                </li> */}
                <li className={`${router.pathname === "/registry" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/registry">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname === "/registry" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <Feather size={24} />
                            </div>
                        </div>
                    </Link>
                </li>
                {/* <li className={`${router.pathname === "/help" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/help">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${router.pathname === "/help" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <HelpCircle size={24} />
                            </div>
                        </div>
                    </Link>
                </li> */}
            </ul>
            <ul className=" h-full flex flex-col">
                <li className="mt-auto mx-auto">
                    <Link href="https://github.com/tamago-labs/x-engine">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer border-transparent border-l-4">
                            <div className={`flex items-center justify-center opacity-60  `}>
                                <GitHub size={24} />
                            </div>
                        </div>
                    </Link>
                </li>
                {/* <li className=" mx-auto mb-0.5">
                    <div onClick={() => openSettings()} className="mx-auto py-3 justify-between p-2 cursor-pointer border-transparent border-l-4">
                        <div className={`flex items-center justify-center opacity-60`}>
                            <Settings size={24} />
                        </div>
                    </div>
                </li> */}
            </ul>
        </nav>
    )
}

export default Navbar