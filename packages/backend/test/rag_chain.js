

import { expect } from "chai";
import { slugify } from "../helpers/index.js";

import EXAMPLE_CONTRACTS from "../example/contracts.js"
import RagChain from "../lib/rag_chain.js";

let rag_chain

describe('#rag_chain()', function () {

    before(function () {
        rag_chain = new RagChain("my_name")
    })

    it('should build rag chain success', async function () {
      
        const file = EXAMPLE_CONTRACTS[0].files[0]

        await rag_chain.database.addFile( file.file_name, file.source_code )

        const data = await rag_chain.database.getFile(file.file_name)
        expect( data ).to.equal(file.source_code)

        // build rag chain
        await rag_chain.build([file.file_name])
        
    })

    it('should give exclusive summary', async function () {
        const summary = await rag_chain.exclusiveSummary()  
        expect( summary).includes("a custom weighted decentralized exchange")
    })

    it('should generate unused variables section', async function () {
        const section_1 = await rag_chain.unusedVariables()
        expect(section_1).to.exist 
    })

    it('should generate access control section', async function () {
        const section_2 = await rag_chain.missingAccessControl()
        expect(section_2).to.exist 
    })

    it('should generate integer overflow section', async function () {
        const section_3 = await rag_chain.integerOverflow()
        expect(section_3).to.exist 
    })

    it('should recommendation section', async function () {
        const section_4 = await rag_chain.recommendation()
        expect(section_4).to.exist 
    })

    it('should generate report', async function () {
        const report = await rag_chain.generateReport() 
        expect(report).to.exist 
    })

    it('Destroy it', async function () {
        await rag_chain.database.destroy()
    })

})