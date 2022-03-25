const Block4EHR = artifacts.require("Block4EHR");

contract("Block4EHR", accounts => {
    let instance;

    before(async () => {
        // ==== ADDING INSTITUTIONS ====
        await instance.addHealthcareInst("i_gbg", "gbg1", "gbg");
        await instance.addHealthcareInst("i_boras", "b1", "boras");
        await instance.addHealthcareInst("i_kungalv", "k1", "boras");
    
        // ==== ADDING MEDICAL PERSONNEL ====
        await instance.addMedicalPersonnel(accounts[1], "d_gbg", "i_gbg");
        await instance.addMedicalPersonnel(accounts[2], "d_boras", "i_boras");
        await instance.addMedicalPersonnel(accounts[3], "d_boras", "i_boras");

        // ==== ADDING PATIENTS ====
        await instance.addPatient(accounts[9], "p_gbg", ["gbg", "kungalv"]);
        await instance.addPatient(accounts[8], "p_boras", ["boras"]);
    });

    describe("hasPermission returns the correct value", function() {
        it("hasPermission return true for a sender within a permissioned region", async function() {

        });
    });
})

contract("Block4EHR", accounts => {
    
})

contract("Block4EHR", accounts => {
    
})