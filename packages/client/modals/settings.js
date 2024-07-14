import { HOST } from "@/constants"
import BaseModal from "./base"
import { useContext } from "react"
import { AccountContext } from "@/hooks/useAccount"



const Settings = ({ visible, close }) => {

    const { profile } = useContext(AccountContext)

    return (
        <BaseModal
            visible={visible}
            title="Configuration"
            close={close}
            maxWidth="max-w-lg"
        >
            <div class="mb-4 font-mono mt-4">
                <label for="file-name" class="block text-white text-sm font-bold mb-2">Host:</label>
                <input value={HOST} type="text" id="file-name" name="file-name"  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div> 
            <div class="mb-4 font-mono mt-4">
                <label for="file-name" class="block text-white text-sm font-bold mb-2">Username:</label>
                <input value={`@${profile && profile.name}`} type="text" id="file-name" name="file-name"  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div> 
            <p className="text-sm mt-2 text-center">You are currently using the early preview version of XReview where identities are randomly generated.</p>
        </BaseModal>
    )
}

export default Settings