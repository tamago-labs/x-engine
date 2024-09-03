import { AuthContext } from "@/hooks/useAuth"
import SubNavbar from "@/layouts/SubNavbar"
import { useContext, useEffect, useState } from "react"
import MarkdownDisplay from "../Markdown"


const RegistryContainer = () => {

    const { getContext } = useContext(AuthContext)

    const [select, setSelect] = useState()
    const [files, setFiles] = useState([])

    useEffect(() => {
        getContext().then(setFiles)
    }, [])


    return (
        <div className="grid grid-cols-10 ">
            <SubNavbar
                title="Context Registry"
                select={select}
                setSelect={setSelect}
                list={files}
                isContext={true}
            />
            <div className={`col-span-8 bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
                <MarkdownDisplay
                    content={select}
                    close={() => setSelect()}
                />
            </div>
        </div>
    )
}

export default RegistryContainer