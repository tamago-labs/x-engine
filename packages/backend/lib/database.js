
import PouchDB from 'pouchdb';


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
                maxDailyLimit: 10,
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

    destroy = async () => {
        await this.db.destroy();
    }

}

export default Database