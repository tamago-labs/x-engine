import PouchDB from 'pouchdb'
import { env } from "../utils/envConfig.js"
import { ethers } from "ethers"

// Account management class

class Account {

    constructor() {
        this.db = new PouchDB(`${env.NODE_ENV}:account`)
    }

    // Password should be hashed on the client side
    signUp = async (email, password) => {

        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/.test(email) === false) {
            throw new Error("Invalid Email")
        }

        const item = {
            _id: email,
            password,
            credits: 30,
            created: new Date().valueOf(),
            messages: [
                "An initial credit of 30 credits has been applied to your account"
            ],
            timestamps: [
                new Date().valueOf()
            ]
        }

        await this.db.put(item)
    }

    logIn = async (email, password) => {

        try {
            let entry = await this.db.get(email)

            if (entry.password !== password) {
                throw new Error("Password mismatched")
            }

            // add daily free credits
            const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
            const yesterdayTs = yesterday.valueOf()

            const dailyCount = entry.timestamps.filter(item => item > yesterdayTs).length

            if (dailyCount === 0) {
                entry.credits = entry.credits + 10
                entry.messages.push("You’ve received your 10 free daily credits")
                entry.timestamps.push(new Date().valueOf())

                await this.db.put(entry)
            }

            return {
                sessionId: ethers.hashMessage(`${email}${entry.created}`), // use simple hash with no expiration on this beta
                email,
                credits: entry.credits,
                created: entry.created,
                messages: entry.messages
            }
        } catch (e) {
            if (e.message === "missing") {
                throw new Error("Given email not found")
            } else {
                throw e
            }
        }

    }

    deduct = async (account, sessionId, filename, credit) => {
        try {
            let entry = await this.db.get(account)

            if (ethers.hashMessage(`${account}${entry.created}`) !== sessionId) {
                throw new Error("Invalid session ID")
            }

            if (entry.credits < credit) {
                throw new Error("Insufficient credits")
            }

            entry.credits = entry.credits - credit
            entry.messages.push(`Received submission request for ${filename}`)
            entry.timestamps.push(new Date().valueOf())

            await this.db.put(entry)

        } catch (e) {
            if (e.message === "missing") {
                throw new Error("Given email not found")
            } else {
                throw e
            }
        }
    }



    destroy = async () => {
        await this.db.destroy();
    }
}

export default Account