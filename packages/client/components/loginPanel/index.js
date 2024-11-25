'use client'

import { AccountContext } from "@/contexts/account"
import { useContext } from "react"
import { FaRegCircleUser } from "react-icons/fa6"
import Link from "next/link"

import { usePathname } from "next/navigation"

const LoginPanel = () => {

    const path = usePathname()

    const { isConnected, redirectToAuthUrl, logout } = useContext(AccountContext)

    return (
        <div className="my-auto">

            {!isConnected && (
                <button onClick={() => {
                    redirectToAuthUrl()
                }} className={`inline-flex  justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>
                    Login <span className="hidden md:inline-block">with Google</span>
                </button>
            )}

            {isConnected && (
                <Link href="/account">
                    {/* <button onClick={() => logout()}
                    className={`inline-flex  justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>
                    Logout
                </button> */}
                    <FaRegCircleUser size={24} className={`my-auto cursor-pointer mb-0.5 ${path === "/account" ? "opacity-100" : "opacity-60 hover:opacity-100"} `}/>
                </Link>
            )}

        </div>
    )
}

export default LoginPanel