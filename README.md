# AI-Code Review for Move Smart Contracts

**The project started and received 1st place in the AI x Web3 track at the [ moveonaptos.dev](https://moveonaptos.dev/) hackathon in July'24. We continue to add more features to enhance security and support smarter development on Move with AI.**

Smart contract audits are costly, especially today when the focus isn't solely on the Ethereum chain. Deploying smart contracts to multiple chains requires separate audits for each chain and each smart contract language, making it impossible for smaller projects to afford.

We provide an AI solution for quickly reviewing smart contracts and generating reports to share with the community. This is particularly useful when releasing minor versions, expanding to new chains or when the project is still at a very early stage and cannot afford to pay for a full audit.

**Please be aware that the project is still in its very early stages and may contain bugs and incomplete features. Use it at your own risk, and note that this cannot replace a full security audit.**

## Features

* Powered by Claude AI, Voyage AI and Langchain
* Built for Move (Aptos, Sui)
* RAG-based training with various vulnerability patterns
* Automatic report generator
* Built-in IDE

## Use Cases

There are several use cases for the AI code review tool as follows:

* Expansion to Move-based chains (Aptos, Sui, Movement).
* Currently developing Move-native applications and preparing for a full security audit.
* The project is in its early stages and needs a code review report to gain early traction.

## Context

We extend the knowledge capacity of the LLM (Claude AI in our case) using the RAG approach by providing context for the AI to understand before further analyzing the source code. The context can be divided into 2 groups as follows:

*  Move language-specific practices
*  Porting from Ethereum's EIP-1470 (https://github.com/SmartContractSecurity/SWC-registry)

The table below lists all the contexts we currently support including vulnerability patterns with more being added over time.

| ID                           | Title                                    | References                                                                                           |
| ---------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------|
| [sui-vs-aptos-move-differences](./packages/context/sui-vs-aptos-move-differences.md)    | Differences Between Sui Move and Aptos Move         |      |
| [move-vector-limitations](./packages/context/move-vector-limitations.md)    | Move Vector Limitations         |      |
| [integer-overflow-and-underflow](./packages/context/integer-overflow-and-underflow.md)    | Integer overflows and underflows         | [CWE-682](https://cwe.mitre.org/data/definitions/682.html)                       |
| [broken-access-controls](./packages/context/broken-access-controls.md)    | Broken access controls                   | [CWE-284](https://cwe.mitre.org/data/definitions/284.html)                     |
| [re-entrancy](./packages/context/re-entrancy.md)    | Re-entrancy                              | [CWE-841](https://cwe.mitre.org/data/definitions/841.html) |

## Backend

The backend made with Node.js and Express.js, serves as the core of the project. It contains API services and a simple queue system to process source code sent by users to external API services one by one. 

|   |type|description|
|---|--- |---                      |
|**/**|get|for heartbeat|
|**/auth/signup**|post|register a user|
|**/auth/login**|post|for login|
|**/submit/**|post|submit a request in base64|
|**/report/:account**|get|get a report in base64|

It runs with two main modules: `database.js` and `rag_chain.js`.

- `database.js` - A JavaScript class that wraps the JavaScript database PouchDB and hosts all user data and reports.
- `rag_chain.js` - A class that contains all prompts to interact with LLM using Langchain to integrate with all external systems.

When creating a report, `rag_chain.js` generates sections based on each provided prompt, starting with a header that summarizes the file information, followed by each security category, such as unused variables, integer overflow, and access control, which we currently support. We may improve accuracy and performance over time.

Example smart contracts on Sui Move and Aptos Move are available to start testing.

## How to Test

You can visit https://app.tamagolabs.com. We provide 3 free requests per user per day. However, you can set up the entire project on your own by following the instructions.

The project uses a Lerna monorepo. After downloading this repo onto your machine, you can then run:

```
npm install
```
  
Ensure you obtain all API keys from the AI services we are using and place them in the .env file.

```
ANTHROPIC_API_KEY=your-api-key
VOYAGEAI_API_KEY=your-api-key 
```

Once everything is ready, we can start the system by

```
npm start
```

There is a `credit_system` folder that contains the smart contract for the credit system, including Mock USDC. The concept is to purchase credits for each report generation since API services are not free. In the long run, we should implement this credit system permanently to cover all expenses.

Tests for the smart contract and backend can also be run by:

```
npm run test-backend
npm run test-credit
```

## Roadmap

We are working on the following improvements for our upcoming beta version:
- Summarizing common vulnerabilities in Move contracts into a specification.
- Reviewing based on these vulnerabilities.
- The more vulnerabilities checked, the more credits paid.
- Gamification credit system.
- Account creation allows the report to be shared publicly.

## Links

Follow our social channels for further updates

- https://twitter.com/Tamago_Labs
- https://tamagolabs.com
- https://discord.com/invite/jNGqJCsegp
- https://www.facebook.com/tamagolabs

## License

MIT © [Tamago Labs](https://github.com/tamago-labs)

