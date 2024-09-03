// import { AccountContext } from '@/hooks/useAccount';
// import useCredit from '@/hooks/useCredit';
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
                            Welcome{` `}
                            {session.email}
                        </>
                    )}
                    {!session && (
                        <>
                            Server is not connected
                        </>
                    )}

                </div>
                <div className='flex ml-auto '>
                    Credits: {session && session.credits || 0}
                </div>

            </div>
        </footer>
    )
}

const FooterOLD = () => {

    const { account } = useWallet()
    const address = account && account.address

    const { profile, connected, quota, loadProfile } = useContext(AccountContext)

    const [balance, setBalance] = useState(0)

    const { getCreditBalance } = useCredit()

    useEffect(() => {
        address && getCreditBalance(address).then(setBalance)
    }, [address])

    useEffect(() => {
        loadProfile()
    }, [])

    return (
        <footer className="mt-auto bg-neutral-900 border-t border-neutral-600  ">
            <div className=" text-xs text-white flex p-1.5">
                <div className='flex flex-row'>
                    <div className="relative mt-auto mb-auto mr-1.5 ml-0.5">
                        <div className={`w-2 h-2 ${connected ? "bg-lime-600" : "bg-yellow-400"} rounded-full`}></div>
                    </div>
                    {profile && connected && (
                        <>
                            Welcome{` @`}
                            {profile.name}
                        </>
                    )}
                    {!connected && (
                        <>
                            Server is not connected
                        </>
                    )}

                </div>
                <div className='flex ml-auto'>
                    {/* Daily quotas: {quota[0]}/{quota[1]} + {balance} credits */}
                </div>

            </div>
        </footer>
    )
}

export default Footer