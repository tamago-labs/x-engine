import PouchDB from 'pouchdb'
import Auth from "pouchdb-auth"

PouchDB.plugin(Auth)

// Account management class

class Account {

    constructor() {
        this.db = new PouchDB('_users')
    }

    init = async () => {
        await this.db.useAsAuthenticationDB()
    }

    signUp = async (username, password) => {

        if (username.length <= 4) {
            throw new Error("Username should have at least four characters")
        }

        if (/^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(password)) {
            await this.db.signUp(username, password)
        } else {
            throw new Error("Password should have at least eight characters, including at least one letter and one number")
        }

    }

    logIn = async (username, password) => {
        const { sessionID } = await this.db.multiUserLogIn(username, password)
        return sessionID
    }

    checkSession = async (currentSessionID) => {
        const { sessionID } = await this.db.multiUserSession(currentSessionID)
        return sessionID
    }

    destroy = async () => {
        await this.db.destroy();
    }
}

export default Account