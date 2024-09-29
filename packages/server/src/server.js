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

    const { task, context, systemPrompt, account, prompts, titles } = args

    await chain.init(context, systemPrompt)

    // switch (task) {
    //     case "submit":
    //         console.log("Submitting...")
    //         await chain.generateReport(account, filename, `${Buffer.from(source_code, 'base64').toString('utf8')}`)
    //         console.log("Report attached.")
    //         break
    //     case "query":
    //         console.log("Querying...")
    //         const report = await chain.query(query)
    //         await chain.saveReport("defi", "Validator Selection Result", report)
    //         console.log("Report saved.")
    //         break
    // }


    switch (task) {
        case "query":
            console.log("Querying with ", prompts.length, " prompts")

            let count = 0

            for (let prompt of prompts) {
                const report = await chain.query(prompt)
                const title = titles[count] ? titles[count] : `Unnamed ${(new Date().toISOString())}`
                await chain.saveReport(account, title, report)
                console.log("Report saved for ", title)
                count += 1
            }

            break
    }

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
    const { account, sessionId, context, titles, prompts } = body

    try {

        const credits = prompts.length

        await accountManager.deduct(account, sessionId, credits * 10)

        queue.push({
            task: "query",
            account,
            context,
            titles,
            prompts
        })

        return res.status(200).json({ status: "ok" });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: "error", message: e.message })
    }

})