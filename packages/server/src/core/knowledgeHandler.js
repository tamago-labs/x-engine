import assert from "assert"
import dotenv from "dotenv"
import DocumentStore from "./documentStore.js"
import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatAnthropic } from "@langchain/anthropic"; 
import { BufferMemory } from "langchain/memory";
import {
    ChatPromptTemplate,
    PromptTemplate
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";



dotenv.config()

// A class that handles specific knowledge using LLM via the RAG approach

// Load API Keys
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ""
assert(ANTHROPIC_API_KEY, "ANTHROPIC_API_KEY environment variable is missing from .env")

const VOYAGEAI_API_KEY = process.env.VOYAGEAI_API_KEY || ""
assert(VOYAGEAI_API_KEY, "VOYAGEAI_API_KEY environment variable is missing from .env")

const model = new ChatAnthropic({
    model: "claude-3-sonnet-20240229",
    temperature: 0
});

class KnowledgeHandler {

    constructor(accountName) {

        this.documentStore = new DocumentStore(accountName)

    }

    // Store a new piece of knowledge in the knowledge base.
    // Key - This can be a filename like Pool.move or a classification such as MWC-102
    // Value - The data encoded in base64 format
    add = async (key, value) => {   
        await this.documentStore.add(key, value)
    }

    // Build a RAG chain for querying the knowledge base
    build = async (fileIds) => { 
        const docs = await this.documentStore.loadDocuments(fileIds)
        
        // Storing docs into memory
        this.retriever = await this.dump(docs)

        const systemTemplate = [
            `You are an AI agent tasked with selecting the best-performing validator for staking. `,
            `Use the following pieces of context to answer the question.`,
            `Use a maximum of three sentences and keep the answer concise.`,
            `\n\n`,
            `Context: {context}`,
        ].join("");

        const chatPrompt = ChatPromptTemplate.fromMessages([
            ["system", systemTemplate],
            ["human", "{input}"],
        ]);

        const questionAnswerChain = await createStuffDocumentsChain({ llm: model, prompt: chatPrompt });

        this.ragChain = await createRetrievalChain({
            retriever: this.retriever,
            combineDocsChain: questionAnswerChain,
        });
    }

    dump = async (texts) => {
        const vectorstore = await MemoryVectorStore.fromDocuments(
            texts,
            new VoyageEmbeddings()
        )
        return vectorstore.asRetriever()
    }

    query = async (input) => {
        if (!this.ragChain) {
            throw new Error("No RAG Chain setup.")
        }

        const result = await this.ragChain.invoke({
            input
        });

        return result.answer
    }
    
    // Delete the database file
    destroy = async () => {
        await this.documentStore.destroy();
    }

}

export default KnowledgeHandler