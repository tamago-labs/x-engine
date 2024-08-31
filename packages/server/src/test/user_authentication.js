// Simulate user authentication

import { expect } from "chai";
import Account from "../core/account.js"

let account

describe("#user_authentication()", function () {

    before(async function () {
        account = new Account()
        await account.init()
    })

    it('should sign in a new user success', async function () {

        // Fails when password has less than eight characters or doesn't include at least one letter and one number
        try {
            await account.signUp("Alice", "Alice")
        } catch (e) { 
            expect(e.message).to.equal("Password should have at least eight characters, including at least one letter and one number")
        }

        await account.signUp("Alice", "Alice123")

        // Fails on duplicate users
        try {
            await account.signUp("Alice", "Alice123")
        } catch (e) {
            expect(e.message).to.equal("Document update conflict")
        }
    })

    it('should log-in success', async function () {
        const sessionId = await account.logIn("Alice", "Alice123")
        const checkedSessionId = await account.checkSession(sessionId) 
        expect(checkedSessionId).to.equal(sessionId)
    })

    after(async function () {
        await account.destroy()
    })

})