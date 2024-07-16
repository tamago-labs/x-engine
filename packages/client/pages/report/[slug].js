import Layout from "@/components/Layout";

import dynamic from 'next/dynamic'

const Report = dynamic(() => import("../../components/ReportNew"), {
    ssr: false,
})

const ReportPage = ({ }) => {

    return (
        <Layout>
            <Report/>
        </Layout>
    )
}


export default ReportPage