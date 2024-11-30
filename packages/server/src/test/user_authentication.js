// Simulate user authentication

import { expect } from "chai";
import { ethers } from "ethers"
import Account from "../core/account.js"

let account


describe("#user_authentication()", function () {

    before(async function () {
        account = new Account()
    })

    it('should list shared wallets success', async function () {

        const { shared_addresses } = await account.systemInfo()

        expect(shared_addresses["sui"].length).to.equal(66)
        expect(shared_addresses["aptos"].length).to.equal(66)
        expect(shared_addresses["evm"].length).to.equal(42)
    })

    it('should list default templates success', async function () {

        const { contexts } = await account.systemInfo()

        expect(contexts["code_review"] !== undefined).to.true
        expect(contexts["gas_optimize"] !== undefined).to.true
    })

    after(async function () {
        await account.destroy()
    })
})