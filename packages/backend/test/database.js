import { expect } from "chai";
import Database from "../lib/database.js"
import { slugify } from "../helpers/index.js";

import EXAMPLE_CONTRACTS from "../example/contracts.js"

let instance

describe('#db()', function () {


    before(function () {

        instance = new Database("my_slug")

    })

    it('should get a daily limit', async function () {

        let entry = await instance.getInfo()
        expect(entry["currentDailyLimit"]).equal(0)
        expect(entry["maxDailyLimit"]).equal(5)
        
        // add usages 
        entry = await instance.addUsage( entry, new Date().valueOf() )
        entry = await instance.addUsage( entry, new Date().valueOf() )
        entry = await instance.addUsage( entry, new Date().valueOf() )
        
        entry = await instance.getInfo()
        expect(entry["currentDailyLimit"]).equal(3)
        expect(entry["maxDailyLimit"]).equal(5)

    })

    it('should add files', async function () {
      
        const files = EXAMPLE_CONTRACTS[0].files

        for (let file of files) {
            await instance.addFile( file.file_name, file.source_code )
            // checking
            const data = await instance.getFile(file.file_name)
            expect( data ).to.equal(file.source_code)
        }
        
    })

    it('should load documents', async function () {
      
        const files = EXAMPLE_CONTRACTS[0].files
        const ids = files.map(item => item.file_name)

        const docs = await instance.loadDocuments(ids)

        expect(docs.length).to.equal(6)
    })

    it('Destroy it', async function () {
        await instance.destroy()
    })

})