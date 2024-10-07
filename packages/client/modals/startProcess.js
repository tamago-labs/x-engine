import { useState, useContext, useCallback } from "react"
import BaseModal from "./base"
import { AuthContext } from "@/hooks/useAuth"
import { AccountContext } from "@/hooks/useAccount"


const StartProcessModal = ({ visible, close }) => {

    const [done, setDone] = useState(false)
    const [errorMessage, setErrorMessage] = useState()

    const [contextName, setContextName] = useState("default")
    const [selected, setSelected] = useState()
    const { projects } = useContext(AccountContext)

    const { submit, session } = useContext(AuthContext)

    const files = projects.reduce((arr, item) => {
        for (let f of item.files) {
            arr.push({
                ...f,
                project_name: item.project_name
            })
        }
        return arr
    }, [])

    const onSubmit = useCallback(async () => {

        setErrorMessage()

        if (!selected) {
            setErrorMessage("File is not selected.")
            return
        }


        const is_done = await submit(contextName, session, selected)

        if (!is_done) {
            setDone(true)
        } else {
            setErrorMessage(is_done)
        }

    }, [contextName, selected, session])



    return (
        <BaseModal
            visible={visible}
            close={() => {
                setDone(false)
                close()
            }}
            title={"Start Review Process"}
            maxWidth="max-w-xl"
        >
            {!done && (
                <div className="pb-4 mt-[20px]">
                    <div className="border p-1 py-4 mt-4 border-neutral-600 rounded-md">
                        <div class="grid grid-cols-7 mt-[10px] p-2 gap-3">
                            <div class="col-span-2 flex">
                                <div className="ml-auto my-auto">
                                    <label class="block text-sm font-medium text-gray-300">Detector:</label>
                                </div>
                            </div>
                            <div className="col-span-5">
                                <select id="categories" value={contextName} onChange={(e) => setContextName(e.target.value)} class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value={"default"}>Move Vulnerability Detection </option>
                                    <option value={"gas-optimize"}>Move Gas Optimization </option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-7 mt-2 p-2 gap-3">
                            <div class="col-span-2 flex">
                                <div className="ml-auto my-auto">
                                    <label class="block text-sm font-medium text-gray-300">File to Check:</label>
                                </div>
                            </div>
                            <div className="col-span-5">
                                <select id="file" onChange={(e) => setSelected(e.target.value ? JSON.parse(e.target.value) : undefined)} class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value={undefined}>{" "}</option>
                                    {files.map((file, index) => {
                                        return (
                                            <option key={index} value={JSON.stringify(file)}>{`(${file.project_name}) `}{file.file_name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="border-t p-1 py-4 pb-2 mx-2 mt-4 border-neutral-600  ">

                            <div class="grid grid-cols-7  p-2 gap-3">
                                <div class="col-span-2 flex">
                                    <div className="ml-auto my-auto">
                                        <label class="block text-sm font-medium text-gray-300">Credits to Take:</label>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    10
                                </div>
                                <div class="col-span-2 flex">
                                    <div className="ml-auto my-auto">
                                        <label class="block text-sm font-medium text-gray-300">Schedule to Check:</label>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    Within 10 mins.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full p-2 pb-0 mt-[20px]">
                        <button onClick={onSubmit} className={`bg-white text-center text-sm font-medium text-black mx-auto px-6 py-2 transition  hover:scale-105  rounded `}>
                            Submit Request
                        </button>
                    </div>
                    {errorMessage && (
                        <div className="text-sm p-2 mt-2 text-center text-yellow-400">
                            {errorMessage}
                        </div>
                    )}
                </div>
            )}

            {done && (
                <div className="pb-4 mt-[20px]">
                    <p>
                        Your file has been submitted for review. Please wait and check the result on the report page.
                    </p>
                    <div className="flex w-full  mt-[20px]">
                        <button onClick={() => {
                            setDone(false)
                            close()
                        }} className={`bg-white text-center text-sm font-medium text-black mx-auto px-6 py-2 transition  hover:scale-105  rounded `}>
                            Close
                        </button>
                    </div>
                </div>)}
        </BaseModal>
    )
}

export default StartProcessModal