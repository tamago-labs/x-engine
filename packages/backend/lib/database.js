
import PouchDB from 'pouchdb';
import { Document } from "langchain/document";

import 'dotenv/config'


class Database {

    db

    constructor(slug) {

        this.db = new PouchDB(slug)

    }

    insertDailyLimit = (data) => {

        const yesterday = new Date(new Date().setDate(new Date().getDate()-1));
        const yesterdayTs = yesterday.valueOf()

        const dailyCount = data.usageTimestamps.filter(item => item > yesterdayTs).length
        data.currentDailyLimit = dailyCount 

        delete data.usageTimestamps
        return data
    }

    getInfo = async () => {
        try {
            const entry = await this.db.get("info")
            return this.insertDailyLimit(entry)
        } catch (e) {

            const item = {
                _id: "info",
                maxDailyLimit: 5,
                created: new Date().valueOf(),
                usageTimestamps: []
            }

            const { rev } = await this.db.put(item)

            return {
                ...item,
                currentDailyLimit: 0,
                _rev: rev
            }
        }

    }

    addUsage = async (entry, timestamp) => { 
        entry.usageTimestamps.push(timestamp)
        const { rev } = await this.db.put(entry)
        return {
            ...entry,
            _rev: rev
        }
    }

    // key - filename ex. test.move
    // value - source code in base64 
    addFile = async (key, value) => {
        try {
            let entry = await this.db.get(key)
            entry.source_code = value
            await this.db.put(entry) 
        } catch (e) {
            const item = {
                _id: key,
                source_code: value
            }
            await this.db.put(item)
        }
    }

    attachReport = async (key, report) => {
        try {
            let entry = await this.db.get(key)
            entry.report = report
            await this.db.put(entry) 
        } catch (e) {

        }
    }

    getFile = async (key) => {
        try {
            const entry = await this.db.get(key)
            return entry.source_code
        } catch (e) {
            return 
        }
    }

    getReport = async (key) => {
        try {
            const entry = await this.db.get(key)
            return entry.report
        } catch (e) {
            return 
        }
    }

    loadDocuments = async (keys = []) => {
        let result = []
        for (let key of keys) {
            const source_code = await this.getFile(key)
            if (source_code) {
                const pageContent = Buffer.from(source_code, 'base64').toString('utf8')
                const doc = new Document({ pageContent , metadata: { source: key } })
                result.push(doc)
            }
        }
        return result
    }

    destroy = async () => {
        await this.db.destroy();
    }

}

export default Database