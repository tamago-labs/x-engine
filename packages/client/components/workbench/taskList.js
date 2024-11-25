import Markdown from 'react-markdown'
import { X, Plus } from "react-feather"
import { useEffect, useState } from 'react'
import axios from "axios";
import Editor from '@monaco-editor/react';
import { PriceServiceConnection } from "@pythnetwork/price-service-client"


const MarkdownPanel = ({ resource, value }) => {

    const [data, setData] = useState(value)

    useEffect(() => {

        (async () => {
            if (!value) {

                if (!resource.includes("0x")) {
                    const { data } = await axios.get(resource)
                    setData(data)
                } else {
                    const connection = new PriceServiceConnection("https://hermes.pyth.network")
                    const priceIds = [
                        resource
                    ]
                    const currentPrices = await connection.getLatestPriceFeeds(priceIds);
                    const btcPrice = `Current BTC price observed from Pyth Oracle is $${((Number((currentPrices[0]).emaPrice.price) / 100000000)).toFixed(0)} `
                    setData(btcPrice)
                }

            }

        })()

    }, [value, resource])

    return (
        <>
            {data && (
                <Markdown>
                    {data}
                </Markdown>
            )}
        </>
    )
}

const TaskList = ({ tasks, active, setActive, removeTask, newTask, onSave }) => {

    const current = tasks.find(item => item.id === active)

    return (
        <div className='flex flex-col h-full overflow-y-auto text-[#D4D4D4] '>
            <div className="h-[40px] border-b w-full border-neutral-600 flex flex-row ">

                {tasks.map((t, index) => {

                    let title

                    if (t.type === "context") {
                        if (!t.resource.includes("0x")) {
                            title = t.resource.split("/").pop()
                        } else {
                            title = "Pyth BTC Feed"
                        }

                    }

                    if (t.type === "input" || t.type === "report") {
                        title = t.id
                    }

                    return (
                        <div key={index} className={` ${active === t.id && "bg-[#1E1E1E]"} text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r `}>
                            <div onClick={() => setActive(t.id)} className='m-auto cursor-pointer hover:underline'>
                                {title}
                            </div>
                            <div onClick={() => removeTask(t.id)} className='m-auto'>
                                <X size={16} className='ml-1.5 mb-0.5 cursor-pointer' />
                            </div>
                        </div>
                    )
                })}

                <div onClick={() => newTask()} className={` cursor-pointer  text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r `}>
                    <div className='m-auto'>
                        New Task
                    </div>
                    <div onClick={() => removeTask(t.id)} className='m-auto'>
                        <Plus size={16} className='ml-1.5 mb-0.5' />
                    </div>
                </div>

            </div>

            {current && current.type === "context" && (
                <div className="p-4">
                    <MarkdownPanel
                        resource={current.resource}
                    />
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
                </div>
            )}

            {current && current.type === "report" && (
                <div className="p-4">
                    <MarkdownPanel
                        value={current.value}
                    />
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
                </div>
            )}

            {current && current.type === "input" && (
                <Editor
                    height="80vh"
                    theme="vs-dark"
                    path={current.id}
                    defaultLanguage={"rust"}
                    defaultValue={current.value}
                    onChange={onSave}
                />
            )

            }

        </div>
    )
}

export default TaskList