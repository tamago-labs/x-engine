import { AccountContext } from "@/hooks/useAccount"
import { useContext } from "react"
import Markdown from 'react-markdown'

const Report = () => {

    const { report } = useContext(AccountContext)


    return (
        <>
            <div className="p-6 text-white text-base max-h-[95vh]   overflow-auto">
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