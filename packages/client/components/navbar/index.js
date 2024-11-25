'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusSquare, Settings, FileText, GitHub } from "react-feather"
import { MdDocumentScanner } from "react-icons/md";
import { LuFolderInput } from "react-icons/lu";
import { MdOutput, MdInput } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import { BiBook } from "react-icons/bi";
import { GrTrigger } from "react-icons/gr";

const Navbar = () => {

    const path = usePathname()

    return (
        <nav className="h-full pt-[29px] flex flex-col">
            <ul className="space-y-2  ">
                <li className={`${path === "/" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${path === "/" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <Home size={24} />
                            </div>
                        </div>
                    </Link>
                </li> 
                 <li className={`${path === "/upload" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/upload">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${path === "/upload" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <PlusSquare size={24} />
                            </div>
                        </div>
                    </Link>
                </li>

                <li className={`${path === "/context" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/context">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${path === "/context" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <BiBook size={24} />
                            </div>
                        </div>
                    </Link>
                </li>

                <li className={`${path === "/trigger" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                    <Link href="/trigger">
                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                            <div className={`flex items-center justify-center ${path === "/trigger" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                <GrTrigger size={24} />
                            </div>
                        </div>
                    </Link>
                </li>
                {/*
                <li className={`  border-transparent border-l-4 `}>
                    <div onClick={openHelp} className="mx-auto py-3 justify-between p-2 cursor-pointer">
                        <div className={`flex items-center justify-center opacity-60 hover:opacity-100`}>
                            <HelpCircle size={24} />
                        </div>
                    </div>
                </li> */}

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