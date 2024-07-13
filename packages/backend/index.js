import * as fastq from "fastq";
import express from "express";
import cors from "cors"
import assert from "assert"
import Database from "./lib/database.js"

import { slugify } from "./helpers/index.js"

import 'dotenv/config'

// const onWorker = async (args) => {

//     const { task, payload } = args

//     const worker = new Worker()

//     switch (task) {
//         case "new_collection":
//             await worker.createCollection(payload)
//             break
//         case "proof_sync":
//             await worker.syncCollection(payload)
//             break

//     }

// }


// // Queue
// const queue = fastq.promise(onWorker, 1)


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

