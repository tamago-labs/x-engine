 import dynamic from 'next/dynamic'

const SourceCode = dynamic(() => import("@/components/SourceCode"), {
    ssr: false,
})

const Explorer = dynamic(() => import("@/components/Explorer"), {
    ssr: false,
})

const Main = () => {

    

    return (
        <div className="grid grid-cols-10 ">
            <div className="col-span-2 bg-neutral-900 min-h-screen   pt-[29px]  border-r border-neutral-600 ">
                <Explorer />
            </div>
            <div className="col-span-8 bg-neutral-900 pt-[29px] border-r border-neutral-600">
                <SourceCode />
            </div> 
        </div>
    )
}

export default Main