import AuthModal from "@/modals/auth";
import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";
import axios from "axios";

export const AuthContext = createContext({})

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            session: undefined,
            isLoggedIn: false,
            modal: false
        }
    )

    const { modal, session, isLoggedIn } = values

    const host = "localhost"
    const prefix = "http"
    const port = "8000"

    const hostname = `${prefix}://${host}:${port}`

    const checkSession = useCallback(async () => {
        if (localStorage.getItem("session")) {
            const session = localStorage.getItem("session")
            dispatch({
                session: JSON.parse(session),
                isLoggedIn: true
            })
        }
    }, [])

    const saveSession = useCallback(async (session) => {
        dispatch({
            session,
            isLoggedIn: true,
            modal: false
        })
        localStorage.setItem("session", JSON.stringify(session))
    }, [])

    const logOut = useCallback(async () => {
        localStorage.removeItem("session")
        dispatch({
            session: undefined,
            isLoggedIn: false
        })
    }, [])

    const signIn = useCallback(async (username, password) => {

        try {
            await axios.post(`${hostname}/auth/signup`, {
                username,
                password
            })
        } catch (e) {
            throw new Error(e.response.data.message)
        }

    }, [])

    const logIn = useCallback(async (username, password) => {

        try {
            const { data } = await axios.post(`${hostname}/auth/login`, {
                username,
                password
            })
            await saveSession(data)
        } catch (e) {
            throw new Error(e.response.data.message)
        }

    }, [])

    const authContext = useMemo(
        () => ({
            isLoggedIn,
            signIn,
            logIn,
            logOut,
            session,
            checkSession,
            showModal: () => dispatch({ modal: true })
        }), [
        session,
        isLoggedIn
    ])

    return (
        <AuthContext.Provider value={authContext}>

            <AuthModal visible={modal} close={() => dispatch({ modal: false })} />

            {children}
        </AuthContext.Provider>
    )
}

export default Provider