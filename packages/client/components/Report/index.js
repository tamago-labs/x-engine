import { AuthContext } from "@/hooks/useAuth"
import SubNavbar from "@/layouts/SubNavbar"
import { useContext, useEffect, useState } from "react"
import MarkdownDisplay from "../Markdown"
import ReportList from "./reportList"


const ReportContainer = () => {

    const { session, getReport } = useContext(AuthContext)

    const [select, setSelect] = useState()
    const [files, setFiles] = useState([])

    useEffect(() => {
        session && getReport(session.email).then(setFiles)
    }, [session])

    return (
        <div className="grid grid-cols-10 ">
            <div className="col-span-2 bg-neutral-900 min-h-screen   pt-[29px]  border-r border-neutral-600 ">
                
                <ReportList
                    selected={select}
                    setSelect={setSelect}
                    list={files}
                />


            </div>

            <div className={`col-span-8 bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
                <MarkdownDisplay
                    content={select}
                    close={() => setSelect()}
                />
            </div>
        </div>
    )
}

export default ReportContainer