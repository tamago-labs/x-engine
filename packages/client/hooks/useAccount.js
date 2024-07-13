import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { slugify } from "@/helpers";
import axios from "axios";
import { HOST } from "@/constants";
import EXAMPLE_CONTRACTS from "../data/example_contracts.json"

export const AccountContext = createContext({})


const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            selected: undefined,
            profile: undefined,
            report: undefined,
            isOpen: false,
            connected: false,
            quota: [0, 0],
            projects: [],
            tick: 0
        }
    )

    const { selected, profile, connected, quota, projects, report, tick, isOpen } = values

    const select = (selected) => {
        dispatch({ selected })
    }

    const checkConnection = async () => {
        try {
            const { data } = await axios.get(HOST)
            if (data && data.status === "ok") {
                dispatch({ connected: true })
            }
        } catch (e) {

        }
    }

    const openReport = () => {
        dispatch({ isOpen : true })
    }

    const closeReport = () => {
        dispatch({ isOpen : false })
    }

    const checkQuota = async (slug) => {
        try {
            const { data } = await axios.get(`${HOST}/account/${slug}`)
            if (data && data.status === "ok") {
                const { account } = data
                dispatch({ quota: [account.currentDailyLimit, account.maxDailyLimit] })
            }
        } catch (e) {

        }
    }

    const checkReport = async (slug, file_name) => {
        try {
            const { data } = await axios.get(`${HOST}/report/${slug}/${file_name}`)
            if (data && data.status === "ok") {
                const { report } = data
                dispatch({ report })
            } else {
                dispatch({ report: undefined })
            }
        } catch (e) {
            dispatch({ report: undefined })
        }
    }

    const submit = useCallback(async (slug, file_name, source_code) => {
        try {

            await axios.post(`${HOST}/submit/${slug}`, {
                file_name,
                source_code
            })

            dispatch({ tick: tick + 1 })

        } catch (e) {

        }
    }, [tick])

    const loadProfile = async () => {

        if (localStorage.getItem("profile")) {
            const profile = localStorage.getItem("profile")
            dispatch({ profile: JSON.parse(profile) })
        } else {
            const profile_id = uuidv4();
            const profile_name = faker.internet.userName();
            const profile_slug = slugify(profile_name)

            const profile = {
                id: profile_id,
                name: profile_name,
                slug: profile_slug
            }

            localStorage.setItem("profile", JSON.stringify(profile))

            dispatch({ profile })
        }

        await checkConnection()
    }

    const loadProjects = async () => {

        dispatch({ projects: EXAMPLE_CONTRACTS })

    }

    useEffect(() => {
        profile && checkQuota(profile.slug)
    }, [profile, tick])

    useEffect(() => {
        console.log(profile && profile.slug, selected && selected.name)
        profile && selected && checkReport(profile.slug, selected.name)
    }, [profile, selected, tick])

    console.log("erport", report)

    const accountContext = useMemo(
        () => ({
            select,
            selected,
            loadProfile,
            loadProjects,
            profile,
            connected,
            quota,
            projects,
            submit,
            report,
            checkReport,
            openReport,
            closeReport,
            isOpen
        }), [
        selected,
        profile,
        connected,
        quota,
        submit,
        projects,
        report,
        isOpen
    ]
    )

    return (
        <AccountContext.Provider value={accountContext}>
            {children}
        </AccountContext.Provider>
    )
}

export default Provider