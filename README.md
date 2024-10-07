# AI-Code Review for Move Smart Contracts

![Screenshot from 2024-10-07 18-38-56.png](https://cdn.dorahacks.io/static/files/19266593268c7fc86031c0245e09564e.png)

Smart contract audits are costly, especially today when the focus isn't solely on the Ethereum chain. Deploying smart contracts to multiple chains requires separate audits for each chain and each smart contract language, making it impossible for smaller projects to afford.

We provide an AI solution for quickly reviewing smart contracts and generating reports to share with the community. This is particularly useful when releasing minor versions, expanding to new chains or when the project is still at a very early stage and cannot afford to pay for a full audit.

**Please be aware that the project is still in its very early stages and may contain bugs and incomplete features. Use it at your own risk, and note that this cannot replace a full security audit.**

- [YouTube](https://www.youtube.com/watch?v=ULfa7UELpHM)
- [App](https://app.tamagolabs.com)

## Features

* Automatic detection of various vulnerabilities
* Gas optimization suggestions based on academically proven resources
* Built-in IDE for seamless code review and editing
* Free and open source
* Powered by advanced AI models like Claude AI, Voyage AI and LangChain

## System Overview

The system comprises a frontend and backend. The backend integrates with external AI services to process code reviews:

* **Claude AI** – Main LLM
* **Voyage AI** – Text embeddings
* **LangChain** – Prompt preparation

Currently, the system can run two workflows, each with a different set of contexts (resources) and prompts. For now, we do not charge for usage, but each user is limited to making 1 request per day and 3 requests on the first day using the credit-based system.

Like any RAG application, we must provide a guidance prompt to structure the output, define the rules, and set conditions before making a call to the LLM via the LangChain SDK. The gas optimization workflow is displayed below.

```
`You are an AI agent assigned to suggest improvements on the provided source code. `,
`Use the following pieces of context to answer the question without referring to the example source code.`,
`Use a maximum of two paragraph and maintain a formal tone to ensure it is suitable for inclusion in a security report.`,
`\n\n`,
`Context: {context}`,
```

For each request, the source code will be wrapped into another prompt.

```
"From the source code below, suggest ways to optimize gas usage",
`${Buffer.from(source_code, 'base64').toString('utf8')}`,
```

The backend has its own database to store account data (which is randomly generated on the frontend side), context data and reports. When a request is submitted, it is attached to a temporary database until a cron job consumes and processes all active jobs every 10 minutes. This helps us reduce costs when building a RAG chain.

## Gas Optimization

This detector allows AI to read through submitted smart contracts and suggest gas optimization improvements in a human-readable, point-by-point report based on academically proven resources as context. This detector is highly useful and fully functional. Anyone can submit Move contracts and optimize gas on the fly.

The table below shows the context we provide for this detector.

| ID                           | Title                                    | References                                                                                           |
| ---------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------|
| [aptos-move-gas-optimization](./packages/context/aptos-move-gas-optimization.md)    | Aptos Move Gas Optimization         |      |

The example result can be displayed below

```
Avoid unnecessary operations: 
In the currentStandings function, you can simplify the calculation by removing the unnecessary multiplication and division operations.
Instead of (op_store.trueVotes*100/op_store.totalVotes*100)/100, you can use op_store.trueVotes*100/op_store.totalVotes.
This will reduce the number of operations and potentially save gas.
```

## Vulnerability Detection

This detector extends the knowledge capacity of the LLM (Claude AI in our case) using the RAG approach by providing context for the AI to understand before further analyzing the source code. The context can be divided into 2 groups as follows:

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

Tests for backend can also be run by:

```
npm run test-backend
```

The whole system can start by:

```
npm start
```

## Awards & Recognition

- (Vulnerability Detection) 1st place in the AI x Web3 track at the [ moveonaptos.dev](https://moveonaptos.dev/) hackathon 

## Links

Follow our social channels for further updates

- https://twitter.com/Tamago_Labs
- https://tamagolabs.com
- https://discord.com/invite/jNGqJCsegp
- https://www.facebook.com/tamagolabs

## License

MIT © [Tamago Labs](https://github.com/tamago-labs)

