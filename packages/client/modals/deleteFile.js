import { useCallback, useContext, useState } from "react"
import BaseModal from "./base"
import { AccountContext } from "@/hooks/useAccount"

const DeleteFileModal = ({ visible, close, selected, project_name }) => {

    const { select, deleteFile } = useContext(AccountContext)

    const [errorMessage, setErrorMessage] = useState()

    const onDelete = useCallback(() => {

        setErrorMessage()

        if (!selected) {
            return
        }

        const file_name = selected.name 

        if (!selected.editable) {
            setErrorMessage("This file can't be removed")
            return 
        }
        
        console.log(project_name, selected)

        deleteFile( project_name, file_name )
        select(undefined)
        close()
        
    },[project_name, selected])

    return (
        <BaseModal
            visible={visible}
            title={"Confirm Deletion"}
            close={close}
            maxWidth="max-w-md"
        >
            <p>
                Are you sure you want to delete this file? This action cannot be undone.
            </p>
            <div className="py-2">
                <b>File Name: </b>
                <span className="font-mono ml-1.5">{selected && selected.name || ""}</span>
            </div> 
            <div className="grid grid-cols-2 gap-3 text-center my-1">
                <div className="col-span-1   ">
                    <button onClick={onDelete} class={`bg-white text-center text-black mx-auto py-2  w-full    rounded-lg `}>
                        Delete
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

export default DeleteFileModal