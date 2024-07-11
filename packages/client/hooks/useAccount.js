import { createContext, useMemo, useReducer } from "react";


export const AccountContext = createContext({})

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            selected: undefined
        }
    )

    const { selected } = values

    const select = (selected) => {
        dispatch({ selected })
    }

    const accountContext = useMemo(
        () => ({
            select,
            selected
        }), [
        selected
    ]
    )

    return (
        <AccountContext.Provider value={accountContext}>
            {children}
        </AccountContext.Provider>
    )
}

export default Provider