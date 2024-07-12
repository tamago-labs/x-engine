import { AccountContext } from '@/hooks/useAccount';
import Link from 'next/link';
import { useContext } from 'react';

const Footer = () => {

    const { profile, connected, quota } = useContext(AccountContext)

    return (
        <footer className="mt-auto bg-neutral-900 border-t border-neutral-600  ">
            <div className=" text-xs text-white flex p-1.5">
                <div className='flex flex-row'>
                    <div className="relative mt-auto mb-auto mr-1.5 ml-0.5">
                        <div className={`w-2 h-2 ${connected ? "bg-lime-600" : "bg-yellow-400"} rounded-full`}></div>
                    </div>
                    {profile && (
                        <>
                            Welcome{` @`}
                            {profile.name}
                        </>
                    )}

                </div>
                <div className='flex ml-auto'>
                    Daily quotas: {quota[0]}/{quota[1]}
                </div>

            </div>
        </footer>
    )
}

export default Footer