import Layout from "@/components/Layout";
import dynamic from 'next/dynamic'

// const CodeReview = dynamic(() => import("@/components/Review"), {
//     ssr: false,
//   })

const Review = () => {

    return (
        <Layout> 
            Review
        </Layout>
    )
}

export default Review