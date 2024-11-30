import PouchDB from 'pouchdb'
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"
import { decodeSuiPrivateKey, encodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { env } from "../utils/envConfig.js"
import { ethers } from "ethers"

// This class manages user authentication and key generation

class AccountManagement {

    constructor() {
        this.db = new PouchDB(`${env.NODE_ENV}:account`)
        this.setup()
    }

    // Setup system account
    setup = async () => {

        try {

            const wallets = await this.setupWallets()
            const templates = await this.setupTemplates()

            await this.db.put({
                _id: "system",
                message: "a message to be signed",
                contexts: templates,
                wallets
            })

        } catch (e) {
            console.log(e)
        }

    }

    setupWallets = async () => {

        // Generate a key for Aptos
        const { privateKey } = Account.generate();

        // Generate a key for Sui
        const keypair = new Ed25519Keypair()

        // Generate for EVM
        const mnemonic_phrase = (ethers.Wallet.createRandom()).mnemonic.phrase

        return [
            {
                "network": "aptos",
                "value": `${privateKey}`
            },
            {
                "network": "sui",
                "value": `${keypair.getSecretKey()}`
            },
            {
                "network": "evm",
                "value": `${mnemonic_phrase}`
            }
        ]

    }

    setupTemplates = async () => {
        return {
            "code_review": {
                "title": "Code Review",
                "description": "Analyze source code for vulnerabilities and provide a formal security report with a vulnerability score array.",
                "system_prompt": [
                    `You are an AI agent assigned to review source code. `,
                    `Use the following pieces of context to answer the question without referring to the example source code.`,
                    `Return vulnerability scores as an array at the beginning.`,
                    `Use a maximum of two paragraph and maintain a formal tone to ensure it is suitable for inclusion in a security report.`,
                    `\n\n`,
                    `Context: {context}`,
                ].join(""),
                "resources": [
                    "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/broken-access-controls.md",
                    "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/integer-overflow-and-underflow.md",
                    "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/move-vector-limitations.md",
                    "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/re-entrancy.md",
                    "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/sui-vs-aptos-move-differences.md"
                ]
            },
            "gas_optimize": {
                "title": "Gas Optimization",
                "description": "Suggest improvements to optimize gas usage in source code while maintaining a concise and formal report format.",
                "system_prompt": [
                    `You are an AI agent assigned to suggest improvements on the provided source code. `,
                    `Use the following pieces of context to answer the question without referring to the example source code.`,
                    `Use a maximum of two paragraph and maintain a formal tone to ensure it is suitable for inclusion in a security report.`,
                    `\n\n`,
                    `Context: {context}`,
                ].join(""),
                "resources": [
                    "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/aptos-move-gas-optimization.md",
                    "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/sui-move-gas-optimization.md"
                ]
            },
            "optimistic_oracle": {
                "title": "Optimistic Oracle",
                "description": "Analyze data from provided links to generate concise outputs for submission to an Optimistic Oracle.",
                "system_prompt": [
                    `You are an AI agent tasked with analyzing provided links.`,
                    `To generate concise outputs suitable for submission to an Optimistic Oracle.`,
                    `\n\n`,
                    `Context: {context}`,
                ].join(""),
                "resources": [
                    "https://raw.githubusercontent.com/tamago-labs/x-engine/refs/heads/main/packages/context/optimistic-oracle.md"
                ]
            }
        }
    }

    // check system wallet addresses
    systemInfo = async () => {

        const entry = await this.db.get("system")

        let shared_addresses = {}

        for (let key of entry.wallets) {

            if (key.network === "aptos") {
                const privateKey = new Ed25519PrivateKey(key.value)
                const thisAccount = await Account.fromPrivateKey({ privateKey })
                shared_addresses["aptos"] = `${thisAccount.accountAddress}`
            } else if (key.network === "sui") {
                const keypair = Ed25519Keypair.fromSecretKey(key.value);
                const address = keypair.getPublicKey().toSuiAddress();
                shared_addresses["sui"] = address
            } else if (key.network === "evm") {
                const evm_wallet = ethers.Wallet.fromPhrase(key.value)
                shared_addresses["evm"] = evm_wallet.address
            }

        }

        return {
            shared_addresses,
            contexts: entry.contexts,
            message: entry.message
        }
    }

    createUserEntry = async (email) => {

        const item = {
            _id: email,
            credits: 30,
            created: new Date().valueOf(),
            messages: [
                "An initial credit of 30 credits has been applied to your account"
            ],
            timestamps: [
                new Date().valueOf()
            ]
        }

        try { 
            await this.db.put(item)
        } catch (e) {

        }

        return item
    }

    getUserInfo = async (email) => {

        try {

            let entry = await this.db.get(email)

            // add daily free credits
            const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
            const yesterdayTs = yesterday.valueOf()

            const dailyCount = entry.timestamps.filter(item => item > yesterdayTs).length

            if (dailyCount === 0) {
                entry.credits = entry.credits + 10
                entry.messages.push("You’ve received your 10 free daily credits")
                entry.timestamps.push(new Date().valueOf())

                await this.db.put(entry)
            }

            return {
                email,
                credits: entry.credits,
                created: entry.created,
                messages: entry.messages
            }
        } catch (e) {
            if (e.message === "missing") { 
                const entry = await this.createUserEntry(email) 
                return {
                    email,
                    credits: entry.credits,
                    created: entry.created,
                    messages: entry.messages
                }
            } else {
                throw e
            }
        }

    }

     // deduct credits
     deduct = async (email, credit) => {

        try {
            let entry = await this.db.get(email)

            if (entry.credits < credit) {
                throw new Error("Insufficient credits")
            }

            entry.credits = entry.credits - credit
            entry.messages.push(`Received submission request`)
            entry.timestamps.push(new Date().valueOf())

            await this.db.put(entry)

        } catch (e) {
            if (e.message === "missing") {
                throw new Error("Given email not found")
            } else {
                throw e
            }
        }

    }


    destroy = async () => {
        await this.db.destroy();
    }


}

export default AccountManagement