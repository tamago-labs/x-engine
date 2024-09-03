

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
        const instruction_1 = await axios.get("https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/instructions/sui-vs-aptos-move-differences.md")
        await chain.add("instruction_1", Buffer.from(instruction_1.data).toString('base64'))

        const weakness_1 = await axios.get("https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-101.md")
        await chain.add("weakness_1", Buffer.from(weakness_1.data).toString('base64'))

        const weakness_2 = await axios.get("https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-106.md")
        await chain.add("weakness_2", Buffer.from(weakness_2.data).toString('base64'))

        const weakness_3 = await axios.get("https://raw.githubusercontent.com/tamago-labs/x-engine/main/packages/MSWC-registry/MSWC-107.md")
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
        // const file = EXAMPLE_CONTRACTS[0].files[0]
        // const result = await chain.generateReport("dummy",`${Buffer.from(file.source_code, 'base64').toString('utf8')}`)
        // console.log(result)

        // Example result
        // Based on the provided source code, here is a code review with a vulnerability score ranging from 0-100%:
        // **Vulnerability Score: 65%**
        // The code implements a custom weighted decentralized exchange (DEX) for trading fungible assets (FA tokens) on the Aptos blockchain. While the code appears to be well-structured and follows best practices for Aptos Move development, there are several potential vulnerabilities and areas for improvement:
        // 1. **Reentrancy Vulnerability (Score: 80%)**: The `swap_out_non_entry` function performs external calls to withdraw tokens from the user's account and deposit tokens into the pool's account. These external calls can potentially be exploited by a malicious contract through reentrancy attacks, allowing an attacker to drain the pool's funds. Proper reentrancy guards should be implemented to prevent this vulnerability.
        // 2. **Arithmetic Overflows/Underflows (Score: 70%)**: Several arithmetic operations involving `u64` and `u128` types are performed without proper checks for overflows or underflows. This could lead to unexpected behavior or vulnerabilities if the calculations exceed the maximum or minimum values of these types. Assertions or safe math libraries should be used to mitigate this risk.
        // 3. **Access Control Issues (Score: 60%)**: While the code implements a whitelist mechanism for allowing users to create new pools, the `add_whitelist` and `remove_whitelist` functions do not have proper access control checks. Any user can potentially add or remove addresses from the whitelist, which could lead to unauthorized pool creation or denial of service attacks.
        // 4. **Lack of Input Validation (Score: 50%)**: Several entry points and public functions do not perform sufficient input validation. For example, the `register_pool` function does not validate the provided token metadata objects or weight values, which could lead to unexpected behavior or vulnerabilities if malformed inputs are provided.
        // 5. **Potential Denial of Service (Score: 70%)**: The `pause` function allows the contract owner to pause or unpause the liquidity pool. If the pool is paused, users will not be able to add or remove liquidity, potentially leading to a denial of service situation.
        // 6. **Centralization Risks (Score: 60%)**: The contract owner (the address `@legato_addr`) has significant control over the contract's behavior, including updating the treasury address, enabling/disabling the whitelist, updating pool fees, and pausing/unpausing pools. This centralized control could be a potential risk if the owner's account is compromised or if the owner acts maliciously.
        // 7. **Lack of Event Emission (Score: 40%)**: While the code emits events for certain actions (e.g., `RegisterPool`, `AddedLiquidity`, `RemovedLiquidity`, `Swapped`), it does not emit events for other important actions, such as updating the treasury address, adding/removing from the whitelist, or updating pool fees. Proper event emission can improve transparency and auditability.
        // 8. **Potential Frontrunning Attacks (Score: 50%)**: The code does not appear to have any measures to prevent frontrunning attacks, where malicious actors could potentially manipulate the order of transactions to their advantage.
        // To mitigate these vulnerabilities and improve the overall security of the contract, it is recommended to implement proper reentrancy guards, input validation, access control mechanisms, safe arithmetic operations, and event emission for critical actions. Additionally, the centralized control over the contract should be carefully reviewed and potentially decentralized to reduce the risk of a single point of failure or malicious behavior.

    })

    after(async function () {
        await chain.destroy()
    })

})