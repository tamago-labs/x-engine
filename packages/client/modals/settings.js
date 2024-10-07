import { HOST } from "@/constants"
import BaseModal from "./base"
import { useCallback, useContext } from "react"
import { AccountContext } from "@/hooks/useAccount"
import useCredit from "@/hooks/useCredit";
import { AuthContext } from "@/hooks/useAuth";

const Settings = ({ visible, close }) => {

    const { logOut, session } = useContext(AuthContext)

    return (
        <BaseModal
            visible={visible}
            // title="Settings"
            close={close}
            maxWidth="max-w-4xl"
        >

            <div className="h-[200px]">

            </div>

            {/* <div className="flex  ">
                <button disabled={!session} onClick={() => {
                    close()
                    logOut()
                }} className={`bg-white text-sm w-[150px]  ${ !session && "opacity-60"}  text-black font-bold py-2 rounded-md `}>
                    Logout
                </button>
            </div> */}

        </BaseModal>
    )
}


// const SettingsOLD = ({ visible, close }) => {

//     const { account } = useWallet()
//     const address = account && account.address

//     const { profile } = useContext(AccountContext)
//     const { faucet, buyCredit } = useCredit()

//     const onFaucet = useCallback(async () => {

//         try {
//             await faucet() 
//             window.location.reload()
//         } catch (e) {
//             console.log(e)
//         }

//     }, [faucet])

//     const onBuy = useCallback(async () => {

//         try {
//             await buyCredit() 
//             window.location.reload()
//         } catch (e) {
//             console.log(e)
//         }

//     },[buyCredit])

//     return (
//         <BaseModal
//             visible={visible}
//             title="Options"
//             close={close}
//             maxWidth="max-w-lg"
//         >
//             <div class="mb-4 font-mono mt-4">
//                 <label for="file-name" class="block text-white text-sm font-bold mb-2">Host:</label>
//                 <input value={HOST} type="text" id="file-name" name="file-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//             </div>
//             <div class="mb-4 font-mono mt-4">
//                 <label for="file-name" class="block text-white text-sm font-bold mb-2">Username:</label>
//                 <input value={`@${profile && profile.name}`} type="text" id="file-name" name="file-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//             </div>

//             <div className="grid grid-cols-2 gap-3 font-mono text-sm my-1 py-2 pt-4">
//                 <div className="col-span-1   ">
//                     <button onClick={onFaucet} class={`bg-white text-center text-black py-2 w-full rounded `}>
//                         Get USDC
//                     </button>
//                 </div>
//                 <div className="col-span-1   ">
//                     <button onClick={onBuy} class={`bg-white text-center text-black py-2 w-full rounded `}>
//                         Buy Credit
//                     </button>
//                 </div>
//             </div>

//             <p className="text-sm mt-2 text-center">This is Mock USDC that is available on the Aptos Testnet and can be purchased for credits within this app only</p>
//         </BaseModal>
//     )
// }

export default Settings