// Test to perform a Move code review

import { expect } from "chai";
import RagChain from "../core/ragChain.js";
import Account from "../core/account.js"

// import axios from "axios"

import EXAMPLE_CONTRACTS from "../example/contracts.json" assert { type: "json" }

let account
let chain

describe('#rag_gas_optimize()', function () {

    before(function () {
        account = new Account()
        chain = new RagChain()
    })

    it('should submit jobs success', async function () {

        for (let i of [1, 2, 3]) {

            const file = EXAMPLE_CONTRACTS[0].files[i - 1]

            await chain.addJob({
                task: "query",
                context: "gas-optimize",
                account: "test@gmail.com",
                title: `Job#${i}`,
                prompt: [
                    "From the source code below, suggest ways to optimize gas usage",
                    `${Buffer.from(file.source_code, 'base64').toString('utf8')}`,
                ].join(),

            })

        }

        const savedJobs = await chain.listJobs()

        expect(savedJobs[0].title).to.equal("Job#1")
        expect(savedJobs[1].title).to.equal("Job#2")
        expect(savedJobs[2].title).to.equal("Job#3")

    })

    it('should execute jobs success', async function () {

        const context = await account.getContext("gas-optimize")
        await chain.executeJobs(context, 1)

        const reports = await chain.getReport("test@gmail.com")
        expect(reports.length).to.equal(1)

        // Uncomment to print out 
        // console.log(reports)

        // Example result
        // To optimize gas usage in the provided source code, consider the following suggestions: 
        // 1. **Minimize Function Calls**
        // Function calls are one of the most expensive operations in terms of gas consumption. Avoid abstracting functionality into helper functions whenever possible. For example, the `get_mut_pool` function could be inlined within the entry points that use it.
        // 2. **Operate on Local Variables** 
        // Operating directly on resources and resource fields consumes significantly more gas than operating on local variables. Whenever a smart contract is operating on the values of a resource, its ownership should be borrowed by a local variable. If necessary, those values can be transferred back to the resource at the end of the function.

    })

    after(async function () {
        await chain.destroy()
    })

})