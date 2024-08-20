import HelpPanel from "@/components/Help"; 
// import dynamic from 'next/dynamic'
import MainLayout from "@/layouts/Main";

// const MainLayout = dynamic(() => import("@/layouts/Main"), {
//     ssr: false,
// })


const HelpPage = () => {
    return (
        <MainLayout>
            <HelpPanel/>
        </MainLayout>
    )
}

export default HelpPage