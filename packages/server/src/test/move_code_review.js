// Test to perform a Move code review

import { expect } from "chai";
import RagChain from "../core/ragChain.js";
import Account from "../core/account.js"

// import axios from "axios"

import EXAMPLE_CONTRACTS from "../example/contracts.json" assert { type: "json" }

let account
let chain

describe('#rag_move_code_review()', function () {

    before(function () {
        account = new Account()
        chain = new RagChain()
    })

    it('should submit jobs success', async function () {

        for (let i of [1, 2, 3]) {

            const file = EXAMPLE_CONTRACTS[0].files[i - 1]

            await chain.addJob({
                task: "query",
                context: "default",
                account: "test@gmail.com",
                title: `Job#${i}`,
                prompt: [
                    "From the below source code, give code review including vulnerability score ranging from 0-100%",
                    `${Buffer.from(file.source_code, 'base64').toString('utf8')}`,
                ].join(),

            })

        }

        // try to override
        for (let i of [1, 2, 3]) {

            const file = EXAMPLE_CONTRACTS[0].files[i - 1]

            await chain.addJob({
                task: "query",
                context: "default",
                account: "test@gmail.com",
                title: `Job#${i}`,
                prompt: [
                    "From the below source code, give code review including vulnerability score ranging from 0-100%",
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

        const context = await account.getContext("default")
        await chain.executeJobs(context, 1 )

        const reports = await chain.getReport("test@gmail.com")
        expect( reports.length ).to.equal(1)

        // Uncomment to print out 
        // console.log(reports)

        // Example result
        // Based on the provided source code, here is the code review with vulnerability scores:
        // [90, 80, 70]
        // 1. **Potential Integer Overflow/Underflow (Score: 90):**
        // The code does not have sufficient checks for integer overflow or underflow in several arithmetic operations involving `u64` values. This could lead to unintended behavior or vulnerabilities. For example, in the `get_amount_out` function, the calculation `coin_in * reserve_out / (reserve_in * (WEIGHT_SCALE - weight_in) + weight_in * reserve_out)` could potentially overflow or underflow without proper checks.
        // 2. **Lack of Access Control (Score: 80):**
        // While the code implements a whitelist mechanism for registering new pools, there is no access control for other critical functions like `update_pool_fee`, `pause`, and `update_treasury_address`. Any account with the `@legato_addr` address can call these functions, which could lead to unauthorized modifications or disruptions.
        // 3. **Potential Reentrancy Vulnerabilities (Score: 70):**
        // The code does not follow the "Checks-Effects-Interactions" pattern, which could potentially lead to reentrancy vulnerabilities. For example, in the `remove_liquidity` function, the LP tokens are burned before transferring the underlying assets to the user's account. If the user's account is a malicious contract, it could potentially re-enter the `remove_liquidity` function and drain the pool's assets.
        // Other potential issues:
        // - **Lack of Input Validation:** Some functions, like `register_pool`, do not validate the input parameters, which could lead to unexpected behavior or vulnerabilities.
        // - **Potential Denial of Service (DoS):** The `pause` function allows the contract owner to pause the entire pool, which could lead to a Denial of Service (DoS) attack if misused.
        // - **Potential Front-Running Attacks:** The code does not implement any measures to prevent front-running attacks, which could allow malicious actors to manipulate the order of transactions and gain an unfair advantage.
        // It's important to note that a comprehensive security audit would be necessary to identify and mitigate all potential vulnerabilities in the codebase.
    })

    after(async function () {
        await chain.destroy()
    })

})