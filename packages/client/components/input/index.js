
"use client"

import { useContext, useState, useCallback, useEffect } from "react"
import { X, Plus, ArrowRight } from "react-feather"
import { AccordianItem } from "../accordian"
import { ServerContext } from "@/contexts/server"
import { AccountContext } from "@/contexts/account"
import BaseModal from "@/modals/base"
import Templates from "../../data/templates_2.json"
import { slugify } from "@/helpers"
import Editor from '@monaco-editor/react';
import { Puff } from 'react-loading-icons'


const CONFIG = {
    TASK_ID: 0,
    TASK_PROMPT: 1,
    TASK_CONTEXT: 2
}

const InputContainer = ({ contexts }) => {

    const contextList = Object.keys(contexts)

    const [modal, setModal] = useState()

    const { user, isConnected } = useContext(AccountContext)
    const { checkSession, session, submit } = useContext(ServerContext)
    const [loading, setLoading] = useState(false)
    const [currentConfig, setCurrentConfig] = useState(CONFIG.TASK_PROMPT)

    const [currentTemplate, setCurrentTemplate] = useState(Templates[0].name)
    const [task, setTask] = useState()

    const template = Templates.find(item => item.name === currentTemplate)

    useEffect(() => {
        if (isConnected && user) {
            const { email } = user
            checkSession(email)
        }
    }, [isConnected, user])

    const onSave = useCallback((value, event) => {
        setTask({
            ...task,
            resources: [
                btoa(value)
            ]
        })
    }, [task])

    const onSubmit = useCallback(async () => {

        if (!user || !task) {
            return
        }

        setLoading(true)

        try {

            await submit(user, contexts[template.context_id], template, task)

            alert("Your task is being processed")

            const { email } = user
            checkSession(email)

        } catch (e) {
            alert(e.message)
        }

        setLoading(false)

    }, [user, task, template, contexts])

    return (
        <>

            <BaseModal
                visible={modal}
                close={() => setModal(false)}
                title="Choose Task Template"
                maxWidth="max-w-md"
            >
                <div>
                    <div className="mt-4 ">
                        <select id="templates" value={currentTemplate} onChange={(e) => setCurrentTemplate(e.target.value)} class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {Templates.map((item, index) => {

                                return (
                                    <option key={index} value={item.name}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="p-2 px-0 mt-2">
                        <button onClick={() => {
                            setTask({
                                id: slugify(currentTemplate),
                                ...template
                            })
                            setModal(false)
                        }} className={`inline-flex w-full justify-center gap-x-1.5 rounded bg-white px-6 py-1.5 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>
                            OK
                        </button>
                    </div>
                </div>
            </BaseModal>

            <div className="grid grid-cols-10  h-full">
                <div className="col-span-2 bg-neutral-900  border-r border-neutral-600 flex flex-col">

                    <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                        <h4 className="m-auto text-gray-400 font-semibold uppercase text-sm tracking-wider">
                            Task Manager
                        </h4>
                    </div>

                    <div class="grid grid-cols-5 gap-2 px-2 mt-6">

                        {!task && (
                            <div className="col-span-5 flex px-1">
                                <div className="  flex   rounded-xl  w-full py-6  border border-neutral-600  ">
                                    <div className="m-auto text-sm text-center w-[60%]">
                                        No new task is created
                                    </div>
                                </div>
                            </div>
                        )}

                        {task && (
                            <div className="col-span-5 flex flex-col px-1">
                                <AccordianItem
                                    title="Task ID"
                                    showPanel={currentConfig === CONFIG.TASK_ID}
                                    onOpen={() => setCurrentConfig(CONFIG.TASK_ID)}
                                >
                                    <p className="text-xs font-medium text-gray-300 mb-2">
                                        ID of your task for identification
                                    </p>
                                    <input value={task.id} onChange={(e) => {
                                        setTask({
                                            ...task,
                                            id: e.target.value
                                        })
                                    }} className="text-sm px-2 py-2 rounded bg-neutral-700 w-full" />
                                </AccordianItem>
                                <AccordianItem
                                    title="Context"
                                    showPanel={currentConfig === CONFIG.TASK_CONTEXT}
                                    onOpen={() => setCurrentConfig(CONFIG.TASK_CONTEXT)}
                                >

                                    <select id="categories" value={task.context_id} onChange={(e) => setTask({
                                        ...task,
                                        context_id: e.target.value
                                    })} class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        {contextList.map((item, index) => {
                                            return (
                                                <option key={index} value={item}> {contexts[item].title} </option>
                                            )
                                        })}
                                    </select>


                                </AccordianItem>
                                <AccordianItem
                                    title="Prompt"
                                    showPanel={currentConfig === CONFIG.TASK_PROMPT}
                                    onOpen={() => setCurrentConfig(CONFIG.TASK_PROMPT)}
                                >
                                    <p className="text-xs font-medium text-gray-300  mb-2">
                                        A prompt for querying with LLM
                                    </p>
                                    <textarea value={task.user_prompt} onChange={(e) => {
                                        setTask({
                                            ...task,
                                            user_prompt: e.target.value
                                        })
                                    }} className="h-[100px] text-sm px-2 py-2 rounded bg-neutral-700 w-full" />
                                </AccordianItem>

                            </div>
                        )}

                        {!isConnected && (
                            <div class="col-span-5 flex mt-2 px-1">
                                <div className="  flex   rounded-xl  w-full py-6  border border-neutral-600  ">
                                    <div className="m-auto text-sm text-center w-[60%]">
                                        You are not logged in
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="py-3 col-span-5 px-2 ">

                            <div className="border-b border-neutral-600 mb-4">
                            </div>

                            <div className="  flex  mb-3  rounded-xl  w-full py-6  border border-neutral-600  ">
                                <div className=" text-sm px-4   flex flex-row">
                                    <div>
                                        Total cost: 10©
                                    </div>


                                </div>
                            </div>
                            <p className="text-xs text-center font-medium text-gray-300  mb-3">
                                Your balance: {session ? session.credits : 0}©
                            </p>

                            <button onClick={onSubmit} disabled={loading}
                                className={` w-full justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>

                                {loading
                                    ?
                                    <Puff
                                        stroke="#000"
                                        className="w-6 h-6 mx-auto"
                                    />
                                    :
                                    <>
                                        Submit Task
                                    </>}
                            </button>
                        </div>

                    </div>

                </div>

                <div className={`col-span-8 bg-neutral-900  `}>

                    <div className='flex flex-col h-full  text-[#D4D4D4] '>

                        <div className="h-[40px] border-b w-full border-neutral-600 flex ">

                            {!task && (
                                <div onClick={() => setModal(true)} className={` cursor-pointer  text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r `}>
                                    <div className='m-auto'>
                                        New Task
                                    </div>
                                    <div className='m-auto'>
                                        <Plus size={16} className='ml-1.5 mb-0.5' />
                                    </div>
                                </div>
                            )}

                            {task && (
                                <div className='bg-[#1E1E1E] text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r '>
                                    <div className='m-auto'>
                                        {task && `${task.id}`}
                                    </div>
                                    <div onClick={() => setTask(undefined)} className='m-auto'>
                                        <X size={16} className='ml-1.5 mb-0.5 cursor-pointer' />
                                    </div>
                                </div>
                            )}

                        </div>

                        {task && task.is_source_code === true && (
                            <div>
                                <Editor
                                    height="90vh"
                                    theme="vs-dark"
                                    path={task.id}
                                    defaultLanguage={"rust"}
                                    defaultValue={atob(task.resources[0])}
                                    onChange={onSave}
                                />
                            </div>
                        )}

                        {task && task.is_source_code === false && (
                            <div className="grid grid-cols-10 gap-2 px-6  mt-6">
                                <div className="col-span-5">
                                    <h2 className="text-2xl font-semibold py-1 mt-2">
                                        Resources
                                    </h2>
                                    <p className="text-base font-medium text-gray-300">
                                        Provide website links to include as resources in the prompt
                                    </p>

                                    <div className="h-[20px]">
                                    </div>

                                    {task.resources.map((item, index) => {
                                        return (
                                            <div className="grid grid-cols-10 py-2 gap-3" key={index}>
                                                <div className="col-span-9">
                                                    <input value={item} onChange={(e) => {
                                                        setTask({
                                                            ...task,
                                                            resources: task.resources.map((item, i) => {
                                                                if (i === index) {
                                                                    item = e.target.value
                                                                }
                                                                return item
                                                            })
                                                        })
                                                    }} className="text-base px-2 py-2 rounded bg-neutral-700 w-full" />
                                                </div>
                                                <div className="col-span-1 flex">
                                                    {index !== 0 && <X className="m-auto cursor-pointer" onClick={() => {
                                                        setTask({
                                                            ...task,
                                                            resources: task.resources.filter((item, i) => i !== index)
                                                        })
                                                    }} />}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <div className="py-3  ">
                                        <button onClick={() => {
                                            if (task.resources.length < 4) {
                                                setTask({
                                                    ...task,
                                                    resources: [...task.resources, "https://cointelegraph.com/"]
                                                })
                                            }

                                        }}
                                            className={`inline-flex  justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 `}>
                                            Add More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )

                        }

                    </div>

                </div>
            </div>
        </>
    )
}

const Wrapper = () => {
    const { contexts } = useContext(ServerContext)

    return (
        <>
            {contexts && (
                <InputContainer
                    contexts={contexts}
                />
            )}
        </>
    )
}

export default Wrapper