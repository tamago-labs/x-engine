import BaseModal from "./base"
import { useCallback, useEffect, useState } from "react"
import TEMPLATES from "../data/templates.json"
import { useRouter } from 'next/navigation'
import { slugify } from "@/helpers"
import Link from "next/link"




const TemplateModal = ({ visible, close }) => {

    const router = useRouter()

    const [selected, setSelected] = useState(TEMPLATES[0].name)

    // const onNext = useCallback(() => {
    //     router.push(`/workbench?template=${slugify(selected)}`)
    // }, [selected])

    const info = TEMPLATES.reduce((output, item) => {
        if (item.name === selected) {
            output = item.description
        }
        return output
    }, undefined)

    return (
        <BaseModal
            visible={visible}
            close={close}
            title="Choose Task Template"
            maxWidth="max-w-md"
        >
            
            <select value={selected} onChange={(e) => setSelected(e.target.value)} class="bg-gray-50  my-4 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {TEMPLATES.map((t, index) => {
                    return (
                        <option key={index} selected={selected === t.name} value={t.name}>{t.name}</option>
                    )
                })}
            </select>

            <div className="text-xs h-[80px]">
                <span className="font-semibold mr-2">{selected}:</span>{info}
            </div>

            <div className="flex mt-[20px]">
                <Link href={`/workbench?template=${slugify(selected)}`} className="inline-flex mx-auto justify-center gap-x-1.5 rounded-full bg-white px-8 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Next
                </Link>
            </div>

        </BaseModal>
    )
}

export default TemplateModal