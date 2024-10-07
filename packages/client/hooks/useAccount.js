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
        dispatch({ isOpen: true })
    }

    const closeReport = () => {
        dispatch({ isOpen: false })
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

        if (localStorage.getItem("projects")) {
            const projects = localStorage.getItem("projects")
            dispatch({ projects: attachFiles(EXAMPLE_CONTRACTS.concat(JSON.parse(projects))) })
        } else {
            dispatch({ projects: attachFiles(EXAMPLE_CONTRACTS) })
        }

    }

    const createProject = async (project_name) => {

        if (localStorage.getItem("projects")) {
            const projects = JSON.parse(localStorage.getItem("projects"))
            localStorage.setItem("projects", JSON.stringify(projects.concat([{
                project_name,
                files: []
            }])))
        } else {

            const projects = [
                {
                    project_name,
                    files: []
                }
            ]

            localStorage.setItem("projects", JSON.stringify(projects))
        }

        const items = JSON.parse(localStorage.getItem("projects"))
        dispatch({ projects: attachFiles(EXAMPLE_CONTRACTS.concat(items)) })
    }

    const createFile = async (project_name, file_name) => {

        if (localStorage.getItem(project_name)) {
            const files = JSON.parse(localStorage.getItem(project_name))
            localStorage.setItem(project_name, JSON.stringify(files.concat({
                "file_name": file_name,
                "editable" : true,
                "source_code": "ICA="
            })))
        } else {

            const files = [
                {
                    "file_name": file_name,
                    "editable" : true,
                    "source_code": "ICA="
                }
            ]

            localStorage.setItem(project_name, JSON.stringify(files))
        }

        const items = JSON.parse(localStorage.getItem("projects"))
        dispatch({ projects: attachFiles(EXAMPLE_CONTRACTS.concat(items)) })
    }

    const attachFiles = (input) => {

        for (let project of input) {
            const project_name = project.project_name
            if (localStorage.getItem(project_name)) {
                const files = JSON.parse(localStorage.getItem(project_name))
                project.files = project.files.concat(files)
            }
        }

        return input
    }

    const deleteProject = async (project_name) => {

        const item_list = JSON.parse(localStorage.getItem("projects"))
        const new_list = item_list.filter(item => item.project_name !== project_name)

        localStorage.setItem("projects", JSON.stringify(new_list))

        try {
            localStorage.removeItem(project_name)
        } catch (e) {

        }

        dispatch({ projects: attachFiles(EXAMPLE_CONTRACTS.concat(new_list)) })
    }

    const saveFile = async (selected, setSelect, project_name, file_name, source_code) => {

        let file_list = JSON.parse(localStorage.getItem(project_name))

        file_list.map((item) => { 
            if (file_name === item.file_name) {
                item.source_code = btoa(source_code)
            }
        })
 
        selected.raw_value = btoa(source_code)
        selected.value = source_code


        localStorage.setItem(project_name, JSON.stringify(file_list))

        setSelect(selected)
    }

    const deleteFile = async (project_name, file_name) => {

        const file_list = JSON.parse(localStorage.getItem(project_name))
        const new_file_list = file_list.filter(item => item.file_name !== file_name)

        localStorage.setItem(project_name, JSON.stringify(new_file_list))

        const item_list = JSON.parse(localStorage.getItem("projects"))

        dispatch({ projects: attachFiles(EXAMPLE_CONTRACTS.concat(item_list)) })
    }

    useEffect(() => {
        profile && checkQuota(profile.slug)
    }, [profile, tick])

    useEffect(() => {
        profile && selected && checkReport(profile.slug, selected.name)
    }, [profile, selected, tick])

    const accountContext = useMemo(
        () => ({
            default_project: EXAMPLE_CONTRACTS[0].project_name,
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
            isOpen,
            createProject,
            deleteProject,
            createFile,
            deleteFile,
            saveFile
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