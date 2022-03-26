const Block4EHR = artifacts.require("Block4EHR");

/**
 * Test for the Block4EHR smart contract. 
 * @author Hampus Jernkrook
 */
contract("Block4EHR", accounts => {
    let instance;

    const inst_gbg = "i_gbg";
    const inst_boras = "i_boras";
    const inst_kungalv = "i_kungalv";
    const doc_gbg = "d_gbg";
    const doc_kungalv = "d_kungalv";
    const doc_boras = "d_boras";
    const pat_gbg_kungalv = "p_gbg_kungalv";
    const pat_kungalv = "p_kungalv";
    const pat_boras = "p_boras";
    const gbg = "gbg";
    const boras = "boras";
    const kungalv = "kungalv";
    const pat_gbg_kungalv_accounts = accounts[9];
    const pat_boras_account = accounts[8];
    const pat_kungalv_account = accounts[7];
    const doc_gbg_account = accounts[1];
    const doc_boras_account = accounts[2];
    const doc_kungalv_account = accounts[3];

    before(async () => {
        instance = await Block4EHR.deployed();

        // ==== ADDING INSTITUTIONS ====
        await instance.addHealthcareInst(inst_gbg, "gbg1", "gbg");
        await instance.addHealthcareInst(inst_boras, "b1", "boras");
        await instance.addHealthcareInst(inst_kungalv, "k1", "kungalv");
    
        // ==== ADDING MEDICAL PERSONNEL ====
        await instance.addMedicalPersonnel(doc_gbg_account, doc_gbg, inst_gbg);
        await instance.addMedicalPersonnel(doc_boras_account, doc_boras, inst_boras);
        await instance.addMedicalPersonnel(doc_kungalv_account, doc_kungalv, inst_kungalv);

        // ==== ADDING PATIENTS ====
        await instance.addPatient(pat_gbg_kungalv_accounts, pat_gbg_kungalv, [gbg, kungalv]);
        await instance.addPatient(pat_boras_account, pat_boras, [boras]);
        await instance.addPatient(pat_kungalv_account, pat_kungalv, [kungalv]);
    });

    describe("hasPermission returns the correct value", function() {
        it("hasPermission returns true for the patient itself", async function() {
            let res = await instance.hasPermission(pat_boras, {from: pat_boras_account});
            assert.ok(res);
        });

        it("hasPermission returns true for a doctor within a permissioned region", async function() {
            let res = await instance.hasPermission(pat_boras, {from: doc_boras_account});
            assert.ok(res);
        });

        it("hasPermission returns false for a sender who does not belong to a permissioned region", async function() {
            let res = await instance.hasPermission(pat_boras, {from: doc_gbg_account});
            assert.strictEqual(res, false);
        });
    });

    describe("getPermissionedRegion sets the permission correctly", function() {
        it("getPermissionedRegions returns the correct array of regions when called by the patient", async function() {
            let res = await instance.getPermissionedRegions(pat_gbg_kungalv, {from: pat_gbg_kungalv_accounts});
            assert.ok(res);
        });

        //TODO: write test for checking that it throws on the wrong sender
    });


    describe("setPermissions sets the permission correctly", function() {
        it("setPermissions sets the permission array correctly when the patient removes a region", async function() {
            let arr = [gbg];
            await instance.setPermissions(pat_gbg_kungalv, arr, {from: pat_gbg_kungalv_accounts});
            let res = await instance.getPermissionedRegions(pat_gbg_kungalv, {from: pat_gbg_kungalv_accounts});
            assert.deepEqual(res, arr);
        });

/* TODO FIX THIS TEST:
        it("setPermissions sets the permission array correctly when the patient adds a region", async function() {
            let arr = await instance.getPermissionedRegions(pat_boras, {from: pat_boras_account});
            arr.push(kungalv); //TODO: arr is an object, not an array so this cannot be done. Throws an error. 
            let res = await instance.getPermissionedRegions(pat_boras, {from: pat_boras_account});
            assert.deepEqual(res, arr);
        });
*/

        //TODO: write test for checking that it throws on the wrong sender
    });

    /*
        TODO: either here or in separate contract section:
            - test updating EHR
            - test getting the EHR CID
    */
})
/*
contract("Block4EHR", accounts => {
    
})

contract("Block4EHR", accounts => {
    
})
*/