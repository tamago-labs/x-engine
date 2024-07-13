import { AccountContext } from '@/hooks/useAccount'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import Report from './Report'

const SourceCode = dynamic(() => import("@/components/SourceCode"), {
    ssr: false,
})

const Explorer = dynamic(() => import("@/components/Explorer"), {
    ssr: false,
})

const Main = () => {

    const { isOpen } = useContext(AccountContext)

    return (
        <div className="grid grid-cols-10 ">
            <div className="col-span-2 bg-neutral-900 min-h-screen   pt-[29px]  border-r border-neutral-600 ">
                <Explorer />
            </div>
            <div className={`${isOpen ? "col-span-4" : "col-span-8"} bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
                <SourceCode />
            </div>
            {isOpen && (
                <div className={`${isOpen ? "col-span-4" : "col-span-8"} bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
                    <Report/>
                </div>
            )

            }
        </div>
    )
}

export default Main