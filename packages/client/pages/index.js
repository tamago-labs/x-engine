import Explorer from "@/components/Explorer";
// import Layout from "@/components/Layout"; 
import Main from "@/components/Main";
import MainLayout from "@/layouts/Main";

//import dynamic from 'next/dynamic'

// const MainLayout = dynamic(() => import("@/layouts/Main"), {
//   ssr: false,
// })

export default function Home() {

  
  return (
    <MainLayout>
       <Main/>
    </MainLayout>
  );
}
