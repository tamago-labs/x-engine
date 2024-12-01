// app/api/protected/route.js

import { NextResponse } from 'next/server'
import { createClient } from "@crypto.com/ai-agent-client";
import axios from "axios";

export const POST = async function fetchAbiRoute(req) {

    const res = new NextResponse()

    const params = await req.json()
    const { contractAddress } = params

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    const EXPLORER_KEY = "bD9psBd9jEalo9Oe2te2t2VmNzXfoKAK"

    const queryOptions = {
        openAI: {
            apiKey: OPENAI_API_KEY,
            model: "gpt-4-turbo",
        },
        chainId: 240,
        explorerKeys: {
            cronosTestnetKey: EXPLORER_KEY,
            cronosZkEvmTestnetKey: EXPLORER_KEY
        },
        context: []
    };

    const client = createClient(queryOptions);

    // const response = await client.agent.generateQuery(`Fetch the ABI for contract at ${contractAddress}`); 

    return NextResponse.json({
        abi: [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "getValue",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_newValue",
                        "type": "uint256"
                    }
                ],
                "name": "updateValue",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "value",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    }, res)
}



