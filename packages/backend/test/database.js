import { expect } from "chai";
import Database from "../lib/database.js"

let instance

describe('#db()', function () {


    before(function () {

        instance = new Database("my_slug", false)

    })

    it('should get a daily limit', async function () {

        let entry = await instance.getInfo()
        expect(entry["currentDailyLimit"]).equal(0)
        expect(entry["maxDailyLimit"]).equal(10)
        
        // add usages 
        entry = await instance.addUsage( entry, new Date().valueOf() )
        entry = await instance.addUsage( entry, new Date().valueOf() )
        entry = await instance.addUsage( entry, new Date().valueOf() )
        
        entry = await instance.getInfo()
        expect(entry["currentDailyLimit"]).equal(3)
        expect(entry["maxDailyLimit"]).equal(10)

    })

    // it('should add a single item', async function () {

    //     const response = await instance.addItems(["id1"], ["foo"], [{ source: "1" }])
    //     expect(response[0]["ok"]).equal(true)

    //     const result = await instance.getItem("id1")

    //     expect(result["_id"]).equal("id1")
    //     expect(result["pageContent"]).equal("foo")
    //     expect(result["metadata"]["source"]).equal("1")
    // })

    // it('should add items', async function () {

    //     const response = await instance.addItems(
    //         ["id2", "id3"],
    //         ["foo", "foo"],
    //         [{ source: "1" }, { source: "2" }]
    //     )
    //     response.map(item => expect(item["ok"]).equal(true))

    //     const result = await instance.getItems("id", "id\ufff0")

    //     expect(result[0]["_id"]).equal("id1")
    //     expect(result[0]["pageContent"]).equal("foo")
    //     expect(result[0]["metadata"]["source"]).equal("1")

    //     expect(result[1]["_id"]).equal("id2")
    //     expect(result[1]["pageContent"]).equal("foo")
    //     expect(result[1]["metadata"]["source"]).equal("1")

    //     expect(result[2]["_id"]).equal("id3")
    //     expect(result[2]["pageContent"]).equal("foo")
    //     expect(result[2]["metadata"]["source"]).equal("2")
    // })

    // it('should update a single item', async function () {

    //     let item = await instance.getItem("id1")

    //     item['pageContent'] = "bar"
    //     item['metadata'] = { source: "2" }

    //     const response = await instance.updateItem("id1", item['_rev'], item.pageContent, item.metadata)
    //     expect(response["ok"]).equal(true)

    //     const result = await instance.getItem("id1")
    //     expect(result["_id"]).equal("id1")
    //     expect(result["pageContent"]).equal("bar")
    //     expect(result["metadata"]["source"]).equal("2")
    // })

    it('Destroy it', async function () {
        await instance.destroy()
    })

})