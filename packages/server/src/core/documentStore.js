import PouchDB from 'pouchdb';
import { Document } from "langchain/document";

// Handles documents from individual accounts and shared accounts

class DocumentStore {

    constructor(accountName) {
        this.accountName = accountName
        this.pouchDb = new PouchDB(accountName)
    }

    // Key - This can be a filename like Pool.move or a classification such as MWC-102
    // Value - The data encoded in base64 format
    add = async (key, value, override = false) => {

        try {
            let entry = await this.pouchDb.get(key) 

            if (override) {
                entry.data = value
            } else {
                const bothData = Buffer.from(entry.data, 'base64').toString('binary') + Buffer.from(value, 'base64').toString('binary')
                const mergedResult = Buffer.from(bothData.toString(), 'binary').toString('base64'); 
                entry.data = mergedResult
            }
            await this.pouchDb.put(entry)
        } catch (e) {
            const item = {
                _id: key,
                data: value
            }
            await this.pouchDb.put(item) 
        }
    }

    // Retrieve data of a single file from the database
    getFile = async (key) => {
        try { 
            const entry = await this.pouchDb.get(key) 
            return entry.data
        } catch (e) {
            return 
        }
    }

    // Retrieve data from multiple files and wrap it into Langchain format
    loadDocuments = async (keys = []) => {
        let result = []
        for (let key of keys) {
            const data = await this.getFile(key) 
            if (data) {
                const pageContent = Buffer.from(data, 'base64').toString('utf8')
                const doc = new Document({ pageContent , metadata: { source: key } })
                result.push(doc)
            }
        } 
        return result
    }

    destroy = async () => {
        await this.pouchDb.destroy();
    }

}

export default DocumentStore