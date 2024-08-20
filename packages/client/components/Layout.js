import Link from "next/link"
import { useRouter } from "next/router"
import Footer from "./Footer"
import { MessageSquare, FileText, Server, Home, Settings, GitHub, Code, Book, BookOpen, List, Edit, HelpCircle, CheckCircle, CheckSquare, Package, Inbox, Activity, Feather } from "react-feather"
import { useContext, useState } from "react"
import { AccountContext } from "@/hooks/useAccount"
import { ModalContext } from "@/hooks/useModal"

const Layout = ({ children }) => {

    const { profile } = useContext(AccountContext)
    const { openSettings } = useContext(ModalContext)

    const router = useRouter()

    return (
        <>
            <div className='flex min-h-screen flex-col bg-neutral-800 text-base font-normal text-gray antialiased  '>
                <div className="-mt-[29px] flex-glow overflow-x-hidden flex flex-row">
                    <aside className=" bg-neutral-800 text-white w-[60px] flex flex-col min-h-screen   border-r border-neutral-600  ">
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
                                {profile && (
                                    <li className={`${router.pathname.includes("report") ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                                        <Link href={`/report/${profile.slug}`}>
                                            <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                                                <div className={`flex items-center justify-center ${router.pathname.includes("report") ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                                    <Book size={24} />
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                )}
                                <li className={`${router.pathname === "/help" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                                    <Link href="/help">
                                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                                            <div className={`flex items-center justify-center ${router.pathname === "/help" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                                <HelpCircle size={24} />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                            <ul className=" h-full flex flex-col">
                                <li className="mt-auto mx-auto">
                                    <Link href="https://github.com/tamago-labs/x-review">
                                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer border-transparent border-l-4">
                                            <div className={`flex items-center justify-center opacity-60  `}>
                                                <GitHub size={24} />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className=" mx-auto mb-0.5">
                                    <div onClick={() => openSettings()} className="mx-auto py-3 justify-between p-2 cursor-pointer border-transparent border-l-4">
                                        <div className={`flex items-center justify-center opacity-60`}>
                                            <Settings size={24} />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                    <div className=" flex-grow overflow-x-hidden  ">
                        {children}
                    </div>
                </div>
                <Footer />
            </div>


        </>
    )
}

export default Layout