import { useContext, useEffect, useState } from "react"
import ContextList from "./contextList"
import MarkdownDisplay from "../Markdown"

const DetectorContainer = () => {

    const [select, setSelect] = useState()

    return (
        <div className="grid grid-cols-10 ">
            <div className="col-span-2 bg-neutral-900 min-h-screen   pt-[29px]  border-r border-neutral-600 ">
              <ContextList
                selected={select}
                setSelect={setSelect}
              />
            </div> 
            <div className={`col-span-8 bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
               <MarkdownDisplay
                     content={select}
                     close={() => setSelect()}
                     setSelect={setSelect}
               />
            </div>
        </div>
    )
}

export default DetectorContainer