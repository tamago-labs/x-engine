
import { ArrowRight, Grid, LogIn, LogOut, Plus, Settings } from "react-feather"


const ResultRow = () => {
    return (
        <div className="bg-neutral-800 group my-1 mb-2 flex cursor-pointer rounded-lg  w-full h-[55px] border border-neutral-600  hover:border-white">
            <div className="duration-300 ml-auto my-auto px-2 mr-2 group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2">
                <ArrowRight />
            </div>
        </div>
    )
}

export default ResultRow