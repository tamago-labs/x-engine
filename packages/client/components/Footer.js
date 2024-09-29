import { AuthContext } from '@/hooks/useAuth';
import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';

const Footer = () => {

    const { session } = useContext(AuthContext)

    return (
        <footer className="mt-auto bg-neutral-900 border-t border-neutral-600  ">
            <div className=" text-xs text-white flex p-1.5">
                <div className='flex flex-row'>
                    <div className="relative mt-auto mb-auto mr-1.5 ml-0.5">
                        <div className={`w-2 h-2 ${session ? "bg-lime-600" : "bg-yellow-400"} rounded-full`}></div>
                    </div>
                    {session && (
                        <> 
                            Credits: {session && session.credits || 0}
                        </>
                    )}
                    {!session && (
                        <>
                            Login to continue
                        </>
                    )}

                </div>
                <div className='flex ml-auto '> 
                    X-Engine v.0.2.0
                </div>

            </div>
        </footer>
    )
}


export default Footer