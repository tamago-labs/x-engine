

// // Test to perform validator selection for liquid staking

// import { expect } from "chai";
// import KnowledgeHandler from "../core/knowledgeHandler.js"

// import EXAMPLE_DATA from "../example/validators.json" assert { type: "json" }

// // The approach is to load each validator's on-chain staking data and current news into a vector memory.
// // Then, let AI score each validator's performance between 0-100% and determine the allocation to stake.

// let handler 

// describe('#rag_liquid_staking()', function () {

//     before(function () {
        
//         handler = new KnowledgeHandler("liquid_staking")

//     })

//     it('should build rag chain success', async function () {
        
//         // Fed the news
//         await handler.add("Cosmostation", EXAMPLE_DATA[0].news_feed)
//         await handler.add("P2P", EXAMPLE_DATA[1].news_feed)
//         await handler.add("KelePool", EXAMPLE_DATA[2].news_feed)

//         // Giving instruction 
//         await handler.add("Instruction", Buffer.from(`
// When selecting a validator, use the following criteria:
// - Daily volume (24h) has low priority.
// - Staking is on the Sui blockchain
//         `, 'binary').toString('base64') )

//         // Build the RAG chain
//         await handler.build(["Instruction", "Cosmostation", "P2P", "KelePool"])
//     })

//     it('should make a simple query success', async function () {
//         const result = await handler.query("How many validators are mentioned?")
//         expect(result).includes("three")
//     })

//     it('should build rag chain success', async function () {
      
//         const result = await handler.query(`
// Based on the given daily stats, which validator is currently the best to stake with?

// Cosmostation

// Volume (24h)
// $1,877,246.41

// Current Staked
// $137.5M 

// APY
// 2.96%

// Commission Rate
// 4.00%

// P2P

// Volume (24h)
// $0

// Current Staked
// $195.9M

// APY
// 2.77%

// Commission Rate
// 10.00%

// P2P

// Volume (24h)
// $0

// Current Staked
// $195.9M

// APY
// 2.77%

// Commission Rate
// 10.00%

// KelePool

// // Test to perform a Move code review

// describe('#rag_move_code_review()', function () {

//     // TBD

// })

// Volume (24h)
// $0

// Current Staked
// $40.2M

// APY
// 2.78%

// Commission Rate
// 8.00%

//         `)

//         // Example result: 
//         // Based on the given criteria and daily stats, the Cosmostation validator appears to be the best option for staking. 
//         // It has a relatively high daily volume of $1,877,246.41, indicating active participation. Additionally, it offers 
//         // a competitive APY of 2.96% with a reasonable commission rate of 4.00%.

//         expect(result).includes("Cosmostation")
    
//     console.log("reuslt :", result)

//     })

//     after(async function () {
//         await handler.destroy() 
//     })

// })