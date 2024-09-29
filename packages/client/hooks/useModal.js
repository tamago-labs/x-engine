import { createContext, useMemo, useReducer } from "react";
import SettingsModal from "@/modals/settings";
import NetworkModal from "@/modals/network"
import StartProcessModal from "@/modals/startProcess";

export const ModalContext = createContext()

const MODAL = {
    NONE: "NONE",
    SETTINGS: "SETTINGS",
    NETWORK: "NETWORK",
    START: "START"
}

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            modal: MODAL.NONE
        }
    )

    const { modal } = values

    const modalContext = useMemo(
        () => ({
            modal,
            openSettings: () => dispatch({ modal: MODAL.SETTINGS }),
            openNetwork: () => dispatch({ modal : MODAL.NETWORK}),
            openStart: () => dispatch({ modal : MODAL.START})
        }), [
        modal
    ]
    )

    return (
        <ModalContext.Provider value={modalContext}>
            <SettingsModal
                visible={modal === MODAL.SETTINGS}
                close={() => dispatch({ modal: MODAL.NONE })}
            />
            <NetworkModal
                visible={modal === MODAL.NETWORK}
                close={() => dispatch({ modal: MODAL.NONE })}
            />
            <StartProcessModal
                visible={modal === MODAL.START}
                close={() => dispatch({ modal: MODAL.NONE })}
            />


            {children}
        </ModalContext.Provider>
    )
}

export default Provider