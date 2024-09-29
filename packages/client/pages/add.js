import MainLayout from "@/layouts/Main";
import dynamic from 'next/dynamic'

const AddContainer = dynamic(() => import("@/components/Add"), {
    ssr: false,
})

export default function Add() {

    return (
        <MainLayout>
            <AddContainer />
        </MainLayout>
    )

}