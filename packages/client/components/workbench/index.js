"use client"

import LeftPanel from "./leftPanel"
import { useSearchParams } from 'next/navigation'
import TEMPLATES from "../../data/templates.json"
import { useCallback, useState } from "react"
import { slugify } from "@/helpers"
import TaskList from "./taskList"
import { Suspense } from 'react'


const WorkbenchContainer = () => {
    return (
        <Suspense>
            <WorkbenchContainerInner/>
        </Suspense>
    )
}

const WorkbenchContainerInner = () => {

    const [tasks, setTasks] = useState([])
    const [active, setActive] = useState()

    const searchParams = useSearchParams()
    const templateName = searchParams.get('template')

    const t = TEMPLATES.reduce((output, item) => {
        if (slugify(item.name) === templateName) {
            output = item
        }
        return output
    }, undefined)

    const addTask = useCallback((task) => {
        if (!tasks.find(item => item.id === task.id)) {
            setTasks(tasks.concat([task]))
            setActive(task.id)
        }
    }, [tasks])

    const newTask = useCallback(() => {

        const total = (tasks.filter(item => item.type === "input" || item.type === "report")).length

        setTasks(tasks.concat([
            {
                id: `task-${total + 1}`,
                type: "input",
                value: `${t.user_prompt}\n${t.examples.join("")}`
            }
        ]))

    }, [tasks, t])

    const removeTask = useCallback((taskId) => {

        if (active === taskId) {
            setActive(undefined)
        }

        const filtered = tasks.filter(item => item.id !== taskId)
        setTasks(filtered)
    }, [active, tasks])

    const onSave = useCallback((value, event) => {
        setTasks(tasks.map((item) => {
            if (item.id === active) {
                item.value = value
            }
            return item
        }))

    }, [tasks, active])

    return (
        (
            <div className="grid grid-cols-10 -mt-[60px] h-[100vh] pt-[60px]">

                <div className="col-span-2 bg-neutral-900 border-t border-r border-neutral-600 flex flex-col">


                    <LeftPanel
                        template={t}
                        addTask={addTask}
                        tasks={tasks}
                        clear={ () => setTasks([]) }
                    />

                </div>
                <div className={`col-span-6 bg-neutral-900  border-t  border-r border-neutral-600  flex flex-col`}>

                    <TaskList tasks={tasks} active={active} setActive={setActive} removeTask={removeTask} newTask={newTask} onSave={onSave} />

                </div>
                <div className="col-span-2 bg-neutral-900 border-t border-neutral-600 flex flex-col">
                     
                </div>

            </div>
        )
    )
}

export default WorkbenchContainer