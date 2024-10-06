import { useContext } from "react"
import BaseModal from "./base"
import { AuthContext } from "@/hooks/useAuth"


const StartProcessModal = ({ visible, close }) => {

    const { isLoggedIn } = useContext(AuthContext)

    return (
        <BaseModal
            visible={visible}
            close={close}
            title={"Start Review Process"}
            maxWidth="max-w-lg"
        >
            {/* {!isLoggedIn ?

                <div className="flex p-4 py-8">
                    <div className="m-auto">
                        Login is required to initiate the process
                    </div>
                </div>

                :
                <div className="pb-4 mt-[20px]">
                    <div className="border p-1 py-2 mt-4 border-neutral-600 rounded-md">
                        <div class="grid grid-cols-7 p-2 gap-3">
                            <div class="col-span-2 flex">
                                <div className="pl-0.5">
                                    <label class="block text-sm font-medium text-gray-300">Process</label>
                                </div>
                            </div> 
                            <div className="col-span-5">
                                <select id="countries" class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option  >XXXX</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

            } */}
        </BaseModal>
    )
}

export default StartProcessModal