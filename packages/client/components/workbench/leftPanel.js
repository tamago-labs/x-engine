import { useCallback, useContext, useEffect, useState } from "react"
import { AccordianItem } from "../accordian"
import { Puff } from 'react-loading-icons'
import { shortText } from "@/helpers"
import { X } from "react-feather"
import { AccountContext } from "@/contexts/account"
import { ServerContext } from "@/contexts/server"

const CONFIG = {
    MASTER_PROMPT: 0,
    CONTEXT: 1,
    TASK_PROMPT: 2,
    REPORT: 3
}


const LeftPanel = ({ addTask, template, tasks, clear }) => {

    const [loading, setLoading] = useState(false)
    const [reports, setReports] = useState([])

    const { isConnected, user } = useContext(AccountContext)
    const { submit, getReport } = useContext(ServerContext)

    const title = template ? template.name : "No Name"
    const info = template ? template.description : ""
    const system_prompt = template ? template.system_prompt : ""
    const user_prompt = template ? template.user_prompt : ""
    const resources = template ? template.resources : []

    const [currentConfig, setCurrentConfig] = useState(CONFIG.TASK_PROMPT)

    const onSubmit = useCallback(async () => {

        if (!user) {
            return
        }

        setLoading(true)

        try {

            await submit(user, template, tasks.filter(item => item.type === "input"))
            clear()
        } catch (e) {
            alert(e.message)
        }

        setLoading(false)

    }, [submit, user, template, tasks])

    useEffect(() => {
        user && getReport(user).then(setReports)
    }, [user])


    return (
        <div className="p-4 py-6">

            <h2 className="text-2xl mb-2 font-semibold">{title}</h2>

            <div className="flex flex-col  border-b border-neutral-600 pb-2">
                <h2 className="text-sm mb-2 text-neutral-400">
                    {info}
                </h2>
                <button className="inline-flex my-2 mr-auto justify-center gap-x-1.5 rounded-full bg-white px-8 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Edit
                </button>
            </div>

            <AccordianItem
                title="Master Prompt"
                showPanel={currentConfig === CONFIG.MASTER_PROMPT}
                onOpen={() => setCurrentConfig(CONFIG.MASTER_PROMPT)}
            >
                <textarea value={system_prompt} className="h-[200px] text-sm px-2 py-2 rounded bg-neutral-700 w-full" />
            </AccordianItem>
            <AccordianItem
                title="Context"
                showPanel={currentConfig === CONFIG.CONTEXT}
                onOpen={() => setCurrentConfig(CONFIG.CONTEXT)}
            >
                {resources.map((item, index) => {
                    return (
                        <div className="text-sm flex flex-row" key={index}>
                            <div onClick={() => addTask({
                                id: item,
                                type: "context",
                                resource: item
                            })} className="flex-grow cursor-pointer hover:underline">
                                {!item.includes("0x") && item.split("/").pop()}
                                {item.includes("0x") && "Pyth BTC Feed"}
                            </div>
                            <div className="w-[30px] flex">
                                <X size={18} className="m-auto cursor-pointer" />
                            </div>

                        </div>
                    )
                })}
            </AccordianItem>
            <AccordianItem
                title="Task Prompt"
                showPanel={currentConfig === CONFIG.TASK_PROMPT}
                onOpen={() => setCurrentConfig(CONFIG.TASK_PROMPT)}
            >
                <textarea value={user_prompt} className="h-[100px] text-sm px-2 py-2 rounded bg-neutral-700 w-full" />
            </AccordianItem>

            <div className="flex flex-col  border-t border-b border-neutral-600 pt-4 pb-2">
                <div className="flex flex-row">
                    <h2 className="text-sm mb-2 text-neutral-400">
                        Total tasks:
                    </h2>
                    <h2 className="text-sm ml-auto mr-2 text-white">
                        {tasks.length}
                    </h2>
                </div>

                <button disabled={tasks.length === 0} onClick={onSubmit} className="inline-flex my-2 mr-auto justify-center gap-x-1.5 rounded-full bg-white px-8 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">

                    {loading
                        ?
                        <Puff
                            stroke="#000"
                            className="w-3 h-3 mx-auto"
                        />
                        :
                        <>
                            Submit
                        </>}

                </button>

                {!isConnected && (
                    <p className="text-sm font-semibold mt-1 text-yellow-400">
                        You are not logged in
                    </p>
                )}

            </div>

            <AccordianItem
                title="Report"
                showPanel={currentConfig === CONFIG.REPORT}
                onOpen={() => setCurrentConfig(CONFIG.REPORT)}
            >
                <>
                    {reports.map((item, index) => {
                        return (
                            <div className="text-sm flex flex-row" key={index}>
                                <div onClick={() => addTask({
                                    id: item.title,
                                    type: "report",
                                    value: item.value
                                })} className="flex-grow cursor-pointer hover:underline">
                                    {item.title}
                                </div>
                                <div className="w-[30px] flex">
                                    <X size={18} className="m-auto cursor-pointer" />
                                </div>

                            </div>
                        )
                    })}
                </>
            </AccordianItem>


        </div>
    )
}

export default LeftPanel