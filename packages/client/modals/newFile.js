import { useCallback, useContext, useState } from "react"
import BaseModal from "./base"
import { AccountContext } from "@/hooks/useAccount"

const NewFileModal = ({ visible, close, project_name }) => {

    const { createFile } = useContext(AccountContext)

    const [text, setText] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const onSave = useCallback(() => {

        setErrorMessage()

        if (!text) {
            setErrorMessage("Name is empty")
            return
        }

        if (!text.includes(".move")) {
            setErrorMessage("Must contain .move")
            return
        }

        if (!/^[\w,\s-]+\.[A-Za-z]{4}$/.test(text)) {
            setErrorMessage("Invalid name")
            return
        }

        createFile(project_name, text)
        setText()
        close()

    }, [text, project_name])

    return (
        <BaseModal
            visible={visible}
            title={"Create New File"}
            close={close}
            maxWidth="max-w-sm"
        >
            <div class="mb-4 font-mono mt-4">
                <label for="file-name" class="block text-white text-sm font-bold mb-2">File Name:</label>
                <input value={text} onChange={(e) => setText(e.target.value)} type="text" id="file-name" name="file-name" placeholder="Enter your file name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="grid grid-cols-2 mt-2 gap-3 text-center my-1">
                <div className="col-span-1   ">
                    <button onClick={onSave} class={`bg-white text-center text-black mx-auto py-2  w-full rounded-lg `}>
                        Save
                    </button>
                </div>
                <div className="col-span-1  ">
                    <button onClick={() => close()} class={`bg-white text-center text-black  mx-auto py-2 w-full rounded-lg `}>
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

export default NewFileModal