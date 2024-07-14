import { useCallback, useContext } from "react"
import BaseModal from "./base"
import { AccountContext } from "@/hooks/useAccount"

const DeleteProjectModal = ({ visible, close, project_name, setProject }) => {

    const { projects, deleteProject, default_project } = useContext(AccountContext)

    const isExample = projects.map(item => item.project_name).filter((item, index) => [0, 1].includes(index)).includes(project_name)

    const onDelete = useCallback(() => {

        if (isExample) {
            return
        }

        deleteProject(project_name)
        setProject(default_project)

        close()

    }, [isExample, project_name, default_project])

    return (
        <BaseModal
            visible={visible}
            title={"Confirm Deletion"}
            close={close}
            maxWidth="max-w-md"
        >
            <p>
                Are you sure you want to delete the project? This action cannot be undone.
            </p>
            <div className="py-2">
                <b>Project Name: </b>
                <span className="font-mono ml-1.5">{project_name}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center my-1">
                <div className="col-span-1   ">
                    <button onClick={onDelete} class={`bg-white text-center text-black mx-auto py-2  w-full    rounded-lg `}>
                        Delete
                    </button>
                </div>
                <div className="col-span-1  ">
                    <button onClick={() => close()} class={`bg-white text-center  text-black  mx-auto py-2   w-full    rounded-lg `}>
                        Cancel
                    </button>
                </div>
            </div>
            {isExample && (
                <div className="text-sm p-2 text-center text-yellow-400">
                    The example project cannot be deleted
                </div>
            )}
        </BaseModal>
    )
}

export default DeleteProjectModal