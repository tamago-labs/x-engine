import * as fastq from "fastq";
import express from "express";
import cors from "cors" 
import Database from "./lib/database.js"
import RagChain from "./lib/rag_chain.js";

import { slugify } from "./helpers/index.js"

import 'dotenv/config'

const onWorker = async (args) => {

    const { task, slug, file_name } = args

    switch (task) {
        case "submit":
            console.log("submitting...")
            const rag_chain = new RagChain(slug)
            await rag_chain.build([file_name])
            const report = await rag_chain.generateReport()
            await rag_chain.database.attachReport(file_name, report)
            console.log("report generated.")
            break
    }

}


// Queue
const queue = fastq.promise(onWorker, 1)

// API

export const app = express();

app.use(express.json());
app.use(cors())

app.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
})

app.get('/', async (req, res) => {
    return res.status(200).json({ status: "ok" });
});

app.get("/account/:slug", async (req, res) => {

    const { params } = req
    const { slug } = params

    const db = new Database(slug)

    return res.status(200).json({ status: "ok", account: await db.getInfo() });
})

app.post("/submit/:slug", async (req, res) => {

    const { body, params } = req
    const { slug } = params
    const { file_name, source_code } = body
 
    const rag_chain = new RagChain(slug)

    await rag_chain.database.addFile( file_name, source_code )
    await rag_chain.database.attachReport(file_name, "Processing...")

    const entry = await rag_chain.database.getInfo() 

    if (entry["maxDailyLimit"] > entry["currentDailyLimit"]) {

        await rag_chain.database.addUsage( await rag_chain.database.db.get("info"), new Date().valueOf() )

        queue.push({
            task: "submit",
            slug,
            file_name
        })

    }

    return res.status(200).json({ status: "ok" });
})

app.get("/report/:slug/:file_name", async (req, res) => {

    const { params } = req
    const { slug, file_name } = params

    const db = new Database(slug)
 
    return res.status(200).json({ status: "ok", report: await db.getReport(file_name) });
})

