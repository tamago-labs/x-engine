import BaseModal from "./base"

const NewProjectModal = ({ visible, close }) => {

    return (
        <BaseModal
            visible={visible}
            title={"Start New Project"}
            close={close}
            maxWidth="max-w-sm"
        >
            <div class="mb-4 font-mono mt-4">
                <label for="project-name" class="block text-white text-sm font-bold mb-2">Project Name:</label>
                <input type="text" id="project-name" name="project-name" placeholder="Enter your project name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div> 
            <div className="grid grid-cols-2 mt-2 gap-3 text-center my-1">
                <div className="col-span-1   ">
                    <button onClick={() => close()} class={`bg-white text-center text-black mx-auto py-2  w-full    rounded-lg `}>
                        Save
                    </button>
                </div>
                <div className="col-span-1  ">
                    <button onClick={() => close()} class={`bg-white text-center text-black  mx-auto py-2   w-full    rounded-lg `}>
                        Cancel
                    </button>
                </div>
            </div>
        </BaseModal>
    )
}

export default NewProjectModal