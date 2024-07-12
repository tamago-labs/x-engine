import { createContext, useEffect, useMemo, useReducer } from "react";
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
            connected: false,
            quota: [0, 0],
            projects: []
        }
    )

    const { selected, profile, connected, quota, projects } = values

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
    }, [profile])

    const accountContext = useMemo(
        () => ({
            select,
            selected,
            loadProfile,
            loadProjects,
            profile,
            connected,
            quota,
            projects
        }), [
        selected,
        profile,
        connected,
        quota,
        projects
    ]
    )

    return (
        <AccountContext.Provider value={accountContext}>
            {children}
        </AccountContext.Provider>
    )
}

export default Provider