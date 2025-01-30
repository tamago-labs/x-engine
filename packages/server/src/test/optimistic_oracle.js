// import { expect } from "chai"
// import RagChain from "../core/ragChain.js"
// import FirecrawlApp from '@mendable/firecrawl-js';

// const app = new FirecrawlApp({ apiKey: "fc-72cdda65628746c199d6b5d30125bade" });

// let chain

// describe('#optimistic_oracle()', function () {

//     before(function () {
//         chain = new RagChain()
//     })

//     it('should submit jobs success', async function () {

//         await chain.addJob({
//             task: "query",
//             account: "test@gmail.com",
//             resources: [
//                 "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/optimistic-oracle.md"
//             ],
//             system_prompt: "You are an AI agent tasked with analyzing provided links to generate concise outputs suitable for submission to an Optimistic Oracle. \n\nContext: {context}",
//             tasks: [
//                 {
//                     id: "test-1",
//                     value: [
//                         "Give the current BTC price from following data ",
//                         (await app.scrapeUrl('https://coinmarketcap.com/', { formats: ['markdown', 'html'] })).data.markdown,
//                         (await app.scrapeUrl('https://www.coingecko.com/', { formats: ['markdown', 'html'] })).data.markdown,
//                     ].join("")
//                 }
//             ]
//         })

//         const savedJobs = await chain.listJobs()
//         expect(savedJobs.length).to.equal(1)
//     })

//     it('should execute jobs success', async function () {

//         await chain.executeJobs()

//         const reports = await chain.getReport("test@gmail.com") 
//         expect(reports.length).to.equal(1)
//     })

//     after(async function () {
//         await chain.destroy()
//     })

// })