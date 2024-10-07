
import { shortAddress } from "@/helpers"
import { ArrowRight, Grid, LogIn, LogOut, Plus, Settings } from "react-feather"


const ResultRow = ({item}) => {
 

    return (
        <div className="bg-neutral-800 group my-1 mb-2 px-4 py-4 text-sm flex flex-row  rounded-lg space-x-5 w-full  border border-neutral-600  hover:border-white">

            <div>
                <h2 className="text-xs text-gray-300">Submitted By</h2>
                <p> {shortAddress(item.account)}</p>
            </div>
             
            <div>
                <h2 className="text-xs text-gray-300">Title</h2>
                <p> {item.title}</p>
            </div>
            <div>
                <h2 className="text-xs text-gray-300">Prompt Size</h2>
                <p> {item.prompt_size}</p>
            </div>
            <div  >
                <h2 className="text-xs text-gray-300">Created At</h2>
                <p> {new Date(Number(item.timestamp)).toLocaleString()}</p>
            </div>

        </div >
    )
}

export default ResultRow