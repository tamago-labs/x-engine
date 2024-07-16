# AI-Powered Code Review for Smart Contracts

Smart contract audits are costly, especially today when the focus isn't solely on the Ethereum chain. Deploying smart contracts to multiple chains requires separate audits for each chain and each smart contract language, making it impossible for smaller projects to afford.

We provide an AI solution for quickly reviewing smart contracts and generating reports to share with the community. This is particularly useful when releasing minor versions, expanding to new chains or when the project is still at a very early stage and cannot afford to pay for a full audit.

**Please be aware that the project is still in its very early stages and may contain bugs and incomplete features. Use it at your own risk, and note that this cannot replace a full security audit.**

## Features

* Powered by Claude AI, Voyage AI and Langchain
* RAG-based training with various vulnerability patterns
* Automatic report generator
* Built-in IDE

## Backend

The backend made with Node.js and Express.js, serves as the core of the project. It contains API services and a simple queue system to process source code sent by users to external API services one by one. 

|   |type|description|
|---|--- |---                      |
|**/**|get|for heartbeat|
|**/account/:slug**|get|get account info|
|**/submit/:slug**|post|submit a request in base64|
|**/report/:slug/:file_name**|get|get a report in base64|

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

Inside the client folder, you may need to switch the HOST from the default API host to your localhost on `constants.js` file.

```
export const HOST = "https://xreview-api.tamago.finance"

// export const HOST = "http://localhost:8000"
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

## License

MIT © [Tamago Labs](https://github.com/tamago-labs)

