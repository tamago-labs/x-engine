
import dynamic from 'next/dynamic'
import MainLayout from "@/layouts/Main";

const Report = dynamic(() => import("../../components/ReportNew"), {
    ssr: false,
})

// const MainLayout = dynamic(() => import("@/layouts/Main"), {
//     ssr: false,
// })

const ReportPage = ({ }) => {

    return (
        <MainLayout>
            <Report />
        </MainLayout>
    )
}


export default ReportPage