import { LayoutContext } from "@/hooks/useLayout";
import BaseModal from "./base";
import { useCallback, useContext } from "react"

const Network = ({ visible, close }) => {

    const { selectSui, selectEth, selectAptos } = useContext(LayoutContext)

    const savePage = (networkName) => {
        localStorage.setItem("xreviewNetwork", networkName)
    }

    return (
        <BaseModal
            visible={visible}
            title="Select Network"
            close={close}
            maxWidth="max-w-sm"
        >
            <div className="grid grid-cols-2  gap-2.5 mt-4 mb-2">
                <div onClick={() => {
                    savePage("Aptos")
                    selectAptos()
                    close()
                }} className={`col-span-1 p-2  rounded-md border bg-neutral-900  flex-1 border-neutral-700 cursor-pointer flex`}>
                    <div className="mx-auto w-[150px] flex px-2 flex-row">
                        <div className="w-[50px] mr-[3px] p-2">
                            <img
                                className="h-full w-full object-contain object-center rounded-full"
                                src={"/assets/aptos-logo.png"}
                                alt=""
                            />
                        </div>
                        <div className="p-2 px-1 my-auto mx-auto text-center  ">
                            <h3 className="font-medium text-base leading-4 text-white">Aptos</h3>
                        </div>
                    </div>
                </div>
                <div onClick={() => {
                    savePage("Sui")
                    selectSui()
                    close()
                }} className={`col-span-1 p-2  rounded-md  border bg-neutral-900  flex-1 border-neutral-700 cursor-pointer flex`}>
                    <div className="mx-auto w-[150px] px-2 flex flex-row">
                        <div className="w-[55px] mr-[3px] p-2">
                            <img
                                className="h-full w-full object-contain object-center rounded-full"
                                src={"/assets/sui-logo.svg"}
                                alt=""
                            />
                        </div>
                        <div className="p-2 px-1 my-auto mx-auto text-center  ">
                            <h3 className="font-medium text-base leading-4 text-white">Sui</h3>
                        </div>
                    </div>
                </div>
                <div onClick={() => {
                    savePage("Ethereum")
                    selectEth()
                    close()
                }} className={`col-span-2 p-2  rounded-md  border bg-neutral-900  flex-1 border-neutral-700 cursor-pointer flex`}>
                    <div className="mx-auto w-[150px]  flex flex-row">
                        <div className="w-[58px] p-2">
                            <img
                                className="h-full w-full object-contain object-center rounded-full"
                                src={"/assets/eth-logo.svg"}
                                alt=""
                            />
                        </div>
                        <div className="p-2 px-1 my-auto mx-auto text-center  ">
                            <h3 className="font-medium text-base leading-4 text-white">Ethereum</h3>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}

export default Network