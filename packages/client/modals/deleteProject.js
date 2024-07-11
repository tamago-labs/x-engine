import BaseModal from "./base"

const DeleteProjectModal = ({ visible, close }) => {

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
                <span className="font-mono ml-1.5">PROJECT NAME</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center my-1">
                <div className="col-span-1   ">
                    <button onClick={() => close()} class={`bg-white text-center text-black mx-auto py-2  w-full    rounded-lg `}>
                        Delete
                    </button>
                </div>
                <div className="col-span-1  ">
                    <button onClick={() => close()} class={`bg-white text-center  text-black  mx-auto py-2   w-full    rounded-lg `}>
                        Cancel
                    </button>
                </div>
            </div>
        </BaseModal>
    )
}

export default DeleteProjectModal