// Simulate user authentication

import { expect } from "chai";
import { ethers } from "ethers"
import Account from "../core/account.js"

let account

describe("#user_authentication()", function () {

    before(async function () {
        account = new Account()
    })

    it('should sign in a new user success', async function () {

        await account.signUp("alice@gmail.com", ethers.hashMessage("password"))

        // Fails on duplicate users
        try {
            await account.signUp("alice@gmail.com", ethers.hashMessage("password"))
        } catch (e) {
            expect(e.message).to.equal("Document update conflict")
        }
    })

    it('should log-in success', async function () {
        
        // Fails on wrong password
        try {
            await account.logIn("alice@gmail.com", ethers.hashMessage("not correct"))
        } catch (e) {
            expect(e.message).to.equal("Password mismatched")
        }

        const response = await account.logIn("alice@gmail.com", ethers.hashMessage("password"))
        expect(response.credits).to.equal(30)
        expect(response.messages.length).to.equal(1)
    })

    after(async function () {
        await account.destroy()
    })

})