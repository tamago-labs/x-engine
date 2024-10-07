import { createContext, useMemo, useReducer } from "react";
import SettingsModal from "@/modals/settings";
import NetworkModal from "@/modals/network"
import StartProcessModal from "@/modals/startProcess";
import HelpModal from "@/modals/help";

export const ModalContext = createContext()

const MODAL = {
    NONE: "NONE",
    SETTINGS: "SETTINGS",
    NETWORK: "NETWORK",
    START: "START",
    HELP: "HELP"
}

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            modal: MODAL.HELP
        }
    )

    const { modal } = values

    const modalContext = useMemo(
        () => ({
            modal,
            openSettings: () => dispatch({ modal: MODAL.SETTINGS }),
            openNetwork: () => dispatch({ modal: MODAL.NETWORK }),
            openStart: () => dispatch({ modal: MODAL.START }),
            openHelp: () => dispatch({ modal: MODAL.HELP })
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
            <HelpModal
                visible={modal === MODAL.HELP}
                close={() => dispatch({ modal: MODAL.NONE })}
            />


            {children}
        </ModalContext.Provider>
    )
}

export default Provider