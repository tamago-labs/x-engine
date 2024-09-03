import express from "express";
import cors from "cors"
import helmet from "helmet"
import * as fastq from "fastq";
import rateLimiter from "./middleware/rateLimiter.js";
import Account from "./core/account.js";
import RagChain from "./core/ragChain.js";

export const app = express()

const accountManager = new Account()
const chain = new RagChain()

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(helmet())
app.use(rateLimiter)

// Setup a worker
const onWorker = async (args) => {

    const { task, account, filename, source_code } = args

    await chain.init([
        "https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/instructions/sui-vs-aptos-move-differences.md",
        "https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-101.md",
        "https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-106.md",
        "https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-107.md"
    ])

    switch (task) {
        case "submit":
            console.log("Submitting...")

            await chain.generateReport(account, filename, `${Buffer.from(source_code, 'base64').toString('utf8')}`)

            console.log("Report attached.")
            break
    }

}

// Queue
const queue = fastq.promise(onWorker, 1)

// Routes

// health-check
app.get('/', async (req, res) => {


    return res.status(200).json({ status: "ok" });
})

app.post("/auth/signup", async (req, res) => {

    const { body } = req
    const { username, password } = body

    try {
        await accountManager.signUp(username, password)
        return res.status(200).json({ status: "ok", username })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }

})

app.post("/auth/login", async (req, res) => {

    const { body } = req
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
    const { account, filename, source_code, sessionId } = body

    try {

        await accountManager.deduct(account, sessionId, filename, 10)

        queue.push({
            task: "submit",
            account,
            filename,
            source_code
        })

        return res.status(200).json({ status: "ok" });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ status: "error", message: e.message })
    }

})

app.get("/report/:account", async (req, res) => {

    const { params } = req
    const { account } = params

    try {
        return res.status(200).json({ status: "ok", reports: await chain.getReport(account) })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }
})



