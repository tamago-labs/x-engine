import AuthModal from "@/modals/auth";
import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";
import axios from "axios";
import { ethers } from "ethers"

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

    const host = process.env.HOST || "localhost"
    const prefix = host === "localhost" ? "http" : "https"
    const port = process.env.PORT || "8000"
    
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
                password: ethers.hashMessage(password)
            })
        } catch (e) {
            throw new Error(e.response.data.message)
        }

    }, [])

    const logIn = useCallback(async (username, password) => {

        try {
            const { data } = await axios.post(`${hostname}/auth/login`, {
                username,
                password: ethers.hashMessage(password)
            })
            await saveSession(data)
        } catch (e) {
            throw new Error(e.response.data.message)
        }

    }, [])

    const submit = useCallback(async (session, filename, source_code) => {

        try {

            await axios.post(`${hostname}/submit`, {
                account: session.email,
                filename,
                source_code,
                sessionId: session.sessionId,
            })

            session.credits = session.credits - 10

            await saveSession(session)
        } catch (e) {
            throw new Error(e.response.data.message)
        }

    }, [])

    const getReport = useCallback(async (username) => {

        try {
            const { data } = await axios.get(`${hostname}/report/${username}`)
            return data.reports
        } catch (e) {
            alert(e && e.response && e.response.data || e.message)
            console.log(e)
            return []
        }

    }, [])

    const getContext = useCallback(async () => {

        const allEntries = [
            "https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/instructions/sui-vs-aptos-move-differences.md",
            "https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-101.md",
            "https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-106.md",
            "https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-107.md"
        ]

        let output = []

        try {
            for (let entry of allEntries) {
                const response = await axios.get(entry)
                output.push(response.data)
            }

            return output
        } catch (e) {
            alert(e && e.response && e.response.data || e.message)
            console.log(e)
            return []
        }

    }, [])

    const authContext = useMemo(
        () => ({
            isLoggedIn,
            signIn,
            submit,
            getContext,
            getReport,
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