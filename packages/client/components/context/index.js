"use client"

import { ServerContext } from "@/contexts/server"
import { shortText } from "@/helpers"
import { useContext, useState } from "react"
import { ArrowRight } from "react-feather"
import MarkdownDisplay from "../markdown"

const ContextContainer = ({ contexts }) => {

    const contextList = Object.keys(contexts)

    const [contextName, setContextName] = useState(contextList[2])
    const [selected, setSelect] = useState()

    return (
        <div className="grid grid-cols-10  h-full">
            <div className="col-span-2 bg-neutral-900  border-r border-neutral-600 flex flex-col">

                <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                    <h4 className="m-auto text-gray-400 font-semibold uppercase text-sm tracking-wider">
                        Context
                    </h4>
                </div>
                <div class="grid grid-cols-5 gap-2 px-2 mt-6">
                    <div class="col-span-5 flex">
                        <div className="pl-0.5">
                            <label className="block text-sm font-medium text-gray-300">Available</label>
                        </div>
                    </div>
                    <div className="col-span-5">
                        <select id="categories" value={contextName} onChange={(e) => setContextName(e.target.value)} class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {contextList.map((item, index) => {
                                return (
                                    <option key={index} value={item}> {contexts[item].title} </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="col-span-5">
                        <h2 className="text-sm font-semibold py-1 mt-2">
                            Description
                        </h2>
                        <p className="text-xs font-medium text-gray-300">
                            {contexts[contextName].description}
                        </p>
                    </div>
                    <div className="col-span-5">
                        <h2 className="text-sm font-semibold py-1 mt-2">
                            System Prompt
                        </h2>
                        <p className="text-xs font-medium text-gray-300">
                            {contexts[contextName].system_prompt}
                        </p>
                    </div>
                    <div className="col-span-5">
                        <h2 className="text-sm font-semibold py-1 mt-2">
                            Resources
                        </h2>
                        { contexts[contextName].resources.map((item, index) => {
                            
                            const filename = item.split("context/")[1]
                            
                            return (
                                <div onClick={() => {
                                    setSelect({
                                        source_code: false,
                                        value: item
                                    })
                                }} className="px-2 py-4 group border rounded my-2 flex flex-row cursor-pointer" key={index}>
                                     <p className="text-xs font-medium my-auto text-gray-300">
                                         {shortText(filename, 1, -20)}
                                     </p>

                                   <ArrowRight className="ml-auto transition group-hover:scale-110" size={14}/>
                                </div>
                            )
                        })}
                        
                    </div>
                </div>


            </div>

            <div className={`col-span-8 bg-neutral-900  `}>
               <MarkdownDisplay
                     content={selected}
                     close={() => setSelect()}
                     setSelect={setSelect}
               />
            </div>

        </div>
    )
}

const Wrapper = () => {

    const { contexts } = useContext(ServerContext)

    return (
        <>
            {contexts && (
                <ContextContainer
                    contexts={contexts}
                />
            )}
        </>
    )
}

export default Wrapper