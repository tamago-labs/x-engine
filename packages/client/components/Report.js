import { AccountContext } from "@/hooks/useAccount"
import { useContext } from "react"
import { X } from "react-feather"
import Markdown from 'react-markdown'

const Report = () => {

    const { report, closeReport } = useContext(AccountContext)


    return (
        <>
            <div className="p-6 pt-2 pr-4 text-white text-base max-h-[95vh] flex flex-col  overflow-auto">
                <div onClick={() => closeReport()} className="ml-auto cursor-pointer">
                    <X size={24}/>
                </div>
                <Markdown>{report}</Markdown> 
            </div>
            <style>
                {`
                 h2 {
                    font-size: 24px;
                    font-weight: 600;
                    margin-top: 20px;
                    margin-bottom: 20px;

                 }
                 h1 {
                    font-size: 32px;
                    font-weight: 600;
                    margin-top: 20px;
                    margin-bottom: 20px;

                 }
                 p {
                    margin-top: 5px;
                 }
                `}
            </style>
        </>



    )
}

export default Report