import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import axios, { AxiosResponse } from "axios";

export const ServerContext = createContext({})

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            session: undefined,
            shared_addresses: undefined,
            contexts: undefined,
            message: undefined
        }
    )

    const { shared_addresses, contexts, message, session } = values

    const checkSession = useCallback(async (email) => {
        await logIn(email)
    }, [])

    const logIn = useCallback(async (email) => {

        const host = process.env.HOST || "localhost"
        const prefix = host === "localhost" ? "http" : "https"
        const port = process.env.PORT || "8000"

        const hostname = `${prefix}://${host}:${port}/login`

        try {
            const { data } = await axios.post(`${hostname}`, {
                email
            })
            dispatch({
                session: data
            })
        } catch (e) {
            throw new Error(e.response.data.message)
        }

    }, [])

    const checkActive = async () => {

        try {

            const host = process.env.HOST || "localhost"
            const prefix = host === "localhost" ? "http" : "https"
            const port = process.env.PORT || "8000"

            const hostname = `${prefix}://${host}:${port}/system`

            const { data } = await axios.get(hostname)

            dispatch({
                ...data
            })

            return data.status === "ok"
        } catch (e) {
            return false
        }

    }

    const submit = useCallback(async (user, template, tasks) => {

        try {

            console.log("submit:", user, template, tasks)

            const host = process.env.HOST || "localhost"
            const prefix = host === "localhost" ? "http" : "https"
            const port = process.env.PORT || "8000"

            const hostname = `${prefix}://${host}:${port}`

            const payload = {
                account: user.email,
                resources: template.resources,
                system_prompt: template.system_prompt,
                tasks
            }

            await axios.post(`${hostname}/submit`, payload)

            return undefined
        } catch (e) {
            return `${e.response.data.message}`
        }

    }, [])

    const getReport = useCallback(async (user) => {

        try {

            const host = process.env.HOST || "localhost"
            const prefix = host === "localhost" ? "http" : "https"
            const port = process.env.PORT || "8000"

            const hostname = `${prefix}://${host}:${port}`

            const { data } = await axios.get(`${hostname}/report/${user.email}`)
            return data.reports
        } catch (e) {
            console.log(e)
            return []
        }

    }, [])

    const serverContext = useMemo(
        () => ({
            checkActive,
            getReport,
            submit,
            shared_addresses,
            message,
            contexts,
            session,
            checkSession
        }), [
        shared_addresses,
        message,
        contexts,
        session
    ])

    return (
        <ServerContext.Provider value={serverContext}>
            {children}
        </ServerContext.Provider>
    )
}

export default Provider