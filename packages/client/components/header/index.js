'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import LoginPanel from "../loginPanel"


const Header = () => {

    const path = usePathname()

    return (
        <div className="h-[60px] flex flex-row w-full py-2 z-10 ">
            <div className="flex-1 hidden sm:flex">

            </div>
            <div className="flex-1 flex flex-row my-auto ml-4 sm:ml-0">
                <div className="mx-auto my-auto w-full max-w-sm flex justify-between py-2 text-sm sm:text-base space-x-[10px]">
                    <Link href="/" className={`  ${path === "/" ? "font-semibold" : "opacity-60 hover:opacity-100"} `}>
                        Dashboard
                    </Link>
                    <Link href="/workbench" className={`  ${path === "/workbench" ? "font-semibold" : "opacity-60 hover:opacity-100"} `}>
                        Workbench
                    </Link>
                    <Link href="/transactions" className={`  ${path === "/transactions" ? "font-semibold" : " opacity-60 hover:opacity-100"} `}>
                        Transactions
                    </Link>
                </div>
            </div>
            <div className="flex-1 flex justify-center">
                <LoginPanel/> 
            </div>
        </div>
    )
}

export default Header