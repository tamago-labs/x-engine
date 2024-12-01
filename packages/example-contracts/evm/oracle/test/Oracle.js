
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");

describe("Oracle", function () {

    async function deploy() {
        const [owner] = await ethers.getSigners();

        const Oracle = await ethers.getContractFactory("Oracle");
        const oracle = await Oracle.deploy();

        return { oracle, owner }
    }

    describe("Deployment", async function () {

        it("Should set the value", async function () {

            const { oracle } = await loadFixture(deploy)

            expect(await oracle.getValue()).to.equal(90000n)

            await oracle.updateValue("97000") 

            expect(await oracle.getValue()).to.equal(97000n)

        })

    })

})