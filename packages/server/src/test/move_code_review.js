
// Test to perform a Move code review

import { expect } from "chai";
import RagChain from "../core/ragChain.js";
import axios from "axios"


import EXAMPLE_CONTRACTS from "../example/contracts.json" assert { type: "json" }

let chain

describe('#rag_move_code_review()', function () {

    before(function () {

        chain = new RagChain()

    })

    it('should build rag chain success', async function () {

        // Fed the knowledge
        const instruction_1 = await axios.get("https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/context/sui-vs-aptos-move-differences.md")
        await chain.add("instruction_1", Buffer.from(instruction_1.data).toString('base64'))

        const weakness_1 = await axios.get("https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/broken-access-controls.md")
        await chain.add("weakness_1", Buffer.from(weakness_1.data).toString('base64'))

        const weakness_2 = await axios.get("https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/integer-overflow-and-underflow.md")
        await chain.add("weakness_2", Buffer.from(weakness_2.data).toString('base64'))

        const weakness_3 = await axios.get("https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/move-vector-limitations.md")
        await chain.add("weakness_3", Buffer.from(weakness_3.data).toString('base64'))

        await chain.build(["instruction_1", "weakness_1", "weakness_2", "weakness_3"])

    })

    it('should differentiate between Sui Move and Aptos Move success', async function () {

        const file = EXAMPLE_CONTRACTS[0].files[0]
        const q = [
            "Is the source code below Sui Move or Aptos Move?",
            `${Buffer.from(file.source_code, 'base64').toString('utf8')}`,
        ].join()

        // Uncomment to reveal 
        // const result = await chain.query(q)
        // console.log(result)

        // Example result
        // Based on the code, this appears to be Aptos Move code. Some key indicators:
        // 1. It imports from the `aptos_framework` and `aptos_std` libraries, which are specific to Aptos:
        // ```
        // use aptos_framework::event;
        // use aptos_framework::fungible_asset;
        // use aptos_framework::object;
        // use aptos_std::comparator;
        // use aptos_std::math128;
        // use aptos_std::math64;
        // use aptos_std::smart_vector;
        // use aptos_std::table;
        // use aptos_std::fixed_point64;
        // 2. It uses Aptos-specific data structures like `ExtendRef`, `ConstructorRef`, and the `ObjectGroup` annotation.
        // 3. It has an `init_module` function that creates an `AMMManager` resource under the deployer's account, which is typical of Aptos modules.
        // 4. It uses the `acquires` keyword when calling functions that access global storage, which is an Aptos Move concept.
        // 5. It uses the `signer` type extensively for access control, another Aptos Move concept.

    })

    it('should generate report success', async function () {

        
        // Uncomment to reveal   
        const file = EXAMPLE_CONTRACTS[0].files[0]
        
        // const result = await chain.query([
        //     "From the below source code, give code review including vulnerability score ranging from 0-100%",
        //     `${Buffer.from(file.source_code, 'base64').toString('utf8')}`,
        // ].join())
        // console.log(result)

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