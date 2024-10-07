import AuthModal from "@/modals/auth";
import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";
import axios from "axios";
import { ethers } from "ethers"
import { faker } from "@faker-js/faker"

export const AuthContext = createContext({})

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            session: undefined,
            isLoggedIn: false
        }
    )

    const { session, isLoggedIn } = values

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
        } else {

            // create a new account

            const email = faker.internet.email()
            const password = "1234"

            await signIn(email, password)
            await logIn(email, password)

        }
    }, [])

    const saveSession = useCallback(async (session) => {
        dispatch({
            session,
            isLoggedIn: true
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
            console.log(e)
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

    const submit = useCallback(async (context, session, file) => {

        try {

            const payload = {
                account: session.email,
                sessionId: session.sessionId,
                context,
                title: context === "default" ? `Review ${file.file_name}` : `Gas Optimize ${file.file_name}`,
                prompt: [
                    context === "default" ? "From the below source code, give code review including vulnerability score ranging from 0-100%" : "From the source code below, suggest ways to optimize gas usage",
                    `${atob(file.source_code)}`,
                ].join()
            }

            console.log("payload:", payload)

            await axios.post(`${hostname}/submit`, payload)

            session.credits = session.credits - 10

            await saveSession(session)

            return undefined
        } catch (e) {
            return `${e.response.data.message}`
        }

    }, [])

    const getReport = useCallback(async (username) => {

        try {
            const { data } = await axios.get(`${hostname}/report/${username}`)
            return data.reports
        } catch (e) {
            console.log(e)
            return []
        }

    }, [])

    const getJobs = useCallback(async () => {

        try {
            const { data } = await axios.get(`${hostname}/jobs`)
            return data.jobs
        } catch (e) {
            console.log(e)
            return []
        }

    }, [])


    const getContext = useCallback(async (contextName) => {

        try {
            const { data } = await axios.get(`${hostname}/context/${contextName}`)
            const urlList = data[contextName].resources

            let output = []

            for (let url of urlList) {
                const response = await axios.get(url)
                if (response) output.push(response.data)
            }

            return output
        } catch (e) {
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
            getJobs,
            session,
            checkSession
        }), [
        session,
        isLoggedIn
    ])

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    )
}

export default Provider