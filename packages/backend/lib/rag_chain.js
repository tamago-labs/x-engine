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
import assert from "assert"
import Database from "./database.js";
import { CommaSeparatedListOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import {
    Markdown,
    italic,
    bold,
    link,
    quote,
    inlineCode,
    code,
  } from '@scdev/declarative-markdown';

import 'dotenv/config'

// API Keys
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ""
assert(ANTHROPIC_API_KEY, "ANTHROPIC_API_KEY environment variable is missing from .env")

const VOYAGEAI_API_KEY = process.env.VOYAGEAI_API_KEY || ""
assert(VOYAGEAI_API_KEY, "VOYAGEAI_API_KEY environment variable is missing from .env")

const model = new ChatAnthropic({
    model: "claude-3-sonnet-20240229",
    temperature: 0
});

class RagChain {

    database
    retriever
    ragChain
    fileIds

    constructor(slug) {
        this.database = new Database(slug)
    }


    store = async (texts) => {

        const vectorstore = await MemoryVectorStore.fromDocuments(
            texts,
            new VoyageEmbeddings()
        )

        return vectorstore.asRetriever()
    }

    build = async (fileIds) => {

        this.fileIds = fileIds

        const docs = await this.database.loadDocuments(fileIds)

        // Storing docs into memory
        this.retriever = await this.store(docs)

        const systemTemplate = [
            `You are a smart contract auditor for the Move language. `,
            `Use the following pieces of context in the source code to answer the question.`,
            `Use a maximum of three sentences and keep the answer concise.`,
            `\n\n`,
            `Context: {context}`,
        ].join("");

        const chat_prompt = ChatPromptTemplate.fromMessages([
            ["system", systemTemplate],
            ["human", "{input}"],
        ]);

        const questionAnswerChain = await createStuffDocumentsChain({ llm: model, prompt: chat_prompt });

        this.ragChain = await createRetrievalChain({
            retriever: this.retriever,
            combineDocsChain: questionAnswerChain,
        });

    }

    query = async (input) => {
        if (!this.ragChain) {
            throw new Error("No Rag Chain setup.")
        }

        const result = await this.ragChain.invoke({
            input
        });

        return result.answer
    }

    exclusiveSummary = async () => {
        if (!this.ragChain) {
            throw new Error("No Rag Chain setup.")
        }
        return await this.query("Provide an exclusive summary of the given source code")
    }

    unusedVariables = async () => {
        if (!this.ragChain) {
            throw new Error("No Rag Chain setup.")
        }

        const parser = new CommaSeparatedListOutputParser();

        const result = await this.ragChain.invoke({
            input: "List unused variables. \n{format_instructions}",
            format_instructions: parser.getFormatInstructions(),
        });

        return result.answer
    }

    missingAccessControl = async () => {
        if (!this.ragChain) {
            throw new Error("No Rag Chain setup.")
        }

        const parser = new CommaSeparatedListOutputParser();

        const result = await this.ragChain.invoke({
            input: "List missing access control \n{format_instructions}",
            format_instructions: parser.getFormatInstructions(),
        });

        return result.answer
    }

    integerOverflow = async () => {
        if (!this.ragChain) {
            throw new Error("No Rag Chain setup.")
        }

        const parser = new CommaSeparatedListOutputParser();

        const result = await this.ragChain.invoke({
            input: "List potential integer overflow issues \n{format_instructions}",
            format_instructions: parser.getFormatInstructions(),
        });

        return result.answer
    }

    recommendation = async () => {
        if (!this.ragChain) {
            throw new Error("No Rag Chain setup.")
        }
        return await this.query("Provide a recommendation to include at the end of the report")
    }

    generateReport = async () => {
        if (!this.ragChain) {
            throw new Error("No Rag Chain setup.")
        }

        console.log("generating...")

        const mkd = new Markdown(this.fileIds[0])

        const summary = await this.exclusiveSummary()

        console.log("summary done")

        mkd
            .paragraph(summary)
            .header("Unused Variable", 2)
            .paragraph("Severity: Low")
            .paragraph(await this.unusedVariables())
            .header("Access Control", 2)
            .paragraph("Severity: Medium")
            .paragraph(await this.missingAccessControl())
            .header("Integer Overflow", 2)
            .paragraph("Severity: High")
            .paragraph(await this.integerOverflow())
            .paragraph(await this.recommendation())
    
        return mkd.render()

    }


}

export default RagChain

