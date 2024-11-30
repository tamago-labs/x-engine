import express from "express";
import cors from "cors"
import * as fastq from "fastq";
import cron from "node-cron"
import Account from "./core/account.js"
import RagChain from "./core/ragChain.js"

import { attachValues } from "./utils/task.js"

export const app = express()

const accountManager = new Account()
const chain = new RagChain()

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(cors())

// Setup a worker
const onWorker = async (args) => {

    const { task } = args

    console.log("Worker started... ")

    try {
        switch (task) {
            case "query":
                await chain.executeJobs()
                break
        }
    } catch (e) {
        console.log(e)
    }

    console.log("Worker done.")
}

// Queue
const queue = fastq.promise(onWorker, 1)

// Routes

// Health check route to verify if the server is running
app.get('/', async (req, res) => {
    return res.status(200).json({ status: "ok" });
})

// System info
app.get('/system', async (req, res) => {
    const systemInfo = await accountManager.systemInfo()
    return res.status(200).json({ status: "ok", ...systemInfo });
})

// User login route
app.post("/login", async (req, res) => {

    const { body } = req
    const { email } = body

    try {
        const response = await accountManager.getUserInfo(email)
        return res.status(200).json({ status: "ok", ...response })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }

})


app.post("/submit", async (req, res) => {

    const { body } = req
    const { account, resources, system_prompt, tasks } = body

    try {

        await accountManager.deduct(account, 10)

        const tasksWithValues = await attachValues(tasks)

        console.log("tasksWithValues : ", tasksWithValues)

        await chain.addJob({
            task: "query",
            account,
            resources,
            system_prompt,
            tasks: tasksWithValues
        })

        return res.status(200).json({ status: "ok" });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: "error", message: e.message })
    }

})


// get all jobs

app.get("/jobs", async (req, res) => {

    try {

        const savedJobs = await chain.listJobs()

        return res.status(200).json({
            status: "ok", jobs: savedJobs.map((item) => {
                return {
                    account: item.account,
                    resources: item.resources,
                    system_prompt: item.system_prompt,
                    timestamp: item.timestamp
                }
            })
        })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }

})

// get reports

app.get("/report/:account", async (req, res) => {

    const { params } = req
    const { account } = params

    try {
        return res.status(200).json({ status: "ok", reports: await chain.getReport(account) })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }
})


// Execute jobs

const executeJobs = async () => {
    queue.push({
        task: "query"
    })
}

cron.schedule('*/3 * * * *', executeJobs)
