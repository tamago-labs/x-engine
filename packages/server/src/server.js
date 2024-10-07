import express from "express";
import cors from "cors"
import * as fastq from "fastq";
import cron from "node-cron"
import Account from "./core/account.js"
import RagChain from "./core/ragChain.js"

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

    const { task, context } = args

    console.log("Worker started: ", context, " jobs")

    try {
        switch (task) {
            case "query":
                const contextInfo = await accountManager.getContext(context)
                await chain.executeJobs(contextInfo, 10)
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

// User signup route
app.post("/auth/signup", async (req, res) => {

    const { body } = req

    // Password must be hashed on the frontend
    const { username, password } = body

    try {
        // Attempt to sign up the user with the provided credentials
        await accountManager.signUp(username, password)
        return res.status(200).json({ status: "ok", username })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }

})

// User login route
app.post("/auth/login", async (req, res) => {

    const { body } = req

    // Password must be hashed on the frontend
    const { username, password } = body

    try {
        const response = await accountManager.logIn(username, password)
        return res.status(200).json({ status: "ok", ...response })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }

})

app.post("/submit", async (req, res) => {

    const { body } = req
    const { account, sessionId, context, title, prompt } = body

    try {

        await accountManager.deduct(account, sessionId, 10)

        await chain.addJob({
            task: "query",
            context,
            account,
            title,
            prompt
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
                    context: item.context,
                    account: item.account,
                    title: item.title,
                    prompt_size: item.prompt.length,
                    timestamp: item.timestamp
                }
            })
        })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }

})

// get context

app.get("/context/:name", async (req, res) => {

    const { params } = req
    const { name } = params

    try {
        return res.status(200).json({ status: "ok", [name]: await accountManager.getContext(name) })
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
        task: "query",
        context: "default"
    })

    // More context

}

cron.schedule('*/10 * * * *', executeJobs)
