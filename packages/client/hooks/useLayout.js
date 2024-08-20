import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";

export const LayoutContext = createContext({})

const NETWORK = {
    APTOS: "Aptos",
    SUI: "Sui",
    ETH: "Ethereum"
}


const Provider = ({ children }) => {



    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            network: NETWORK.APTOS
        }
    )

    const { network } = values

    const layoutContext = useMemo(
        () => ({
            network,
            allNetworks: NETWORK,
            selectSui: () => dispatch({ network: NETWORK.SUI }),
            selectAptos: () => dispatch({ network: NETWORK.APTOS }),
            selectEth: () => dispatch({ network: NETWORK.ETH }),
            selectNetwork: (networkName) => dispatch({ network: networkName }),
        }), [
        network
    ]
    )

    return (
        <LayoutContext.Provider value={layoutContext}>
            {children}
        </LayoutContext.Provider>
    )
}

export default Provider