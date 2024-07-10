import Layout from "@/components/Layout";
import dynamic from 'next/dynamic'

const CodeReview = dynamic(() => import("@/components/Review"), {
    ssr: false,
  })

const Review = () => {

    return (
        <Layout>
            <CodeReview/>
        </Layout>
    )
}

export default Review