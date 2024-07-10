import Layout from "@/components/Layout"; 
import dynamic from 'next/dynamic'


const CodeReview = dynamic(() => import("@/components/Review"), {
  ssr: false,
})

export default function Home() {

 

  return (
    <Layout> 
        {/* <CodeReview/> */}
    </Layout>
  );
}
