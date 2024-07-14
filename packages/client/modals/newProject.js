import { useCallback, useContext, useState } from "react"
import { AccountContext } from "@/hooks/useAccount"
import BaseModal from "./base"

const NewProjectModal = ({ visible, close, setProject }) => {

    const { projects, createProject } = useContext(AccountContext)

    const [text, setText] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const onSave = useCallback(() => {

        setErrorMessage()

        if (!text) {
            setErrorMessage("Name is empty")
            return
        }

        if (text.length < 4 || text.length > 80) {
            setErrorMessage("Name must be between 4 and 80 characters long");
            return;
        }

        if (!/^(\w+\.?)*\w+$/.test(text)) {
            setErrorMessage("Invalid name")
            return
        }

        if (projects.map(item => item.project_name).includes(text) ) {
            setErrorMessage("Name is duplicated");
            return;
        }

        createProject(text)
        setProject(text)
        setText()
        close()

    }, [text, projects])

    return (
        <BaseModal
            visible={visible}
            title={"Start New Project"}
            close={close}
            maxWidth="max-w-sm"
        >
            <div class="mb-4 font-mono mt-4">
                <label for="project-name" class="block text-white text-sm font-bold mb-2">Project Name:</label>
                <input value={text} onChange={(e) => setText(e.target.value)} type="text" id="project-name" name="project-name" placeholder="Enter your project name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="grid grid-cols-2 mt-2 gap-3 text-center my-1">
                <div className="col-span-1   ">
                    <button onClick={onSave} class={`bg-white text-center text-black mx-auto py-2  w-full    rounded-lg `}>
                        Save
                    </button>
                </div>
                <div className="col-span-1  ">
                    <button onClick={() => close()} class={`bg-white text-center text-black  mx-auto py-2   w-full    rounded-lg `}>
                        Cancel
                    </button>
                </div>
            </div>
            {errorMessage && (
                <div className="text-sm p-2 text-center text-yellow-400">
                    {errorMessage}
                </div>
            )}
        </BaseModal>
    )
}

export default NewProjectModal