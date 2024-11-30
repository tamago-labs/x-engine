'use client'

import { ServerContext } from "@/contexts/server"
import { useState, useContext, useEffect } from "react"

const Footer = () => {

    const [isActive, setActive] = useState(false)

    const { checkActive } = useContext(ServerContext)

    useEffect(() => {
        checkActive().then(setActive)
    }, [])

    return (
        <footer className="mt-auto bg-neutral-900 border-t border-neutral-600  ">
            <div className=" text-xs text-white flex p-1.5">
                <div className='flex flex-row'>
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
                <div className='flex ml-auto '>
                    X-Engine v.0.3.0
                </div>
            </div>
        </footer>
    )
}

export default Footer