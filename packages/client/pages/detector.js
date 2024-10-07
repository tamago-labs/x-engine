import MainLayout from "@/layouts/Main";
import dynamic from 'next/dynamic'

const DetectorContainer = dynamic(() => import("@/components/Detector"), {
    ssr: false,
})

export default function Detector() {

    return (
        <MainLayout>
            <DetectorContainer />
        </MainLayout>
    )

}