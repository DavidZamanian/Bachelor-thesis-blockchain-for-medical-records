const Block4EHR = artifacts.require("Block4EHR");

/**
 * Tests for the Block4EHR smart contract. 
 * Testing that error are thrown were to be tested using chai, 
 * but e.g. https://github.com/chaijs/chai/issues/958 
 * describes an issue with how chai won't work with asyn functions.
 * We thus use a work-around which is slighlty less elegant. 
 * 
 * @author Hampus Jernkrook
 * @author Edenia Isaac
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

        // ==== ADDING REGIONS ====
        await instance.addRegion(gbg, "gbg_name");
        await instance.addRegion(boras, "boras_name");
        await instance.addRegion(kungalv, "kungalv_name");

        // ==== ADDING INSTITUTIONS ====
        await instance.addHealthcareInst(inst_gbg, "gbg1", gbg);
        await instance.addHealthcareInst(inst_boras, "b1", boras);
        await instance.addHealthcareInst(inst_kungalv, "k1", kungalv);

        // ==== ADDING MEDICAL PERSONNEL ====
        await instance.addMedicalPersonnel(doc_gbg_account, doc_gbg, inst_gbg);
        await instance.addMedicalPersonnel(doc_boras_account, doc_boras, inst_boras);
        await instance.addMedicalPersonnel(doc_kungalv_account, doc_kungalv, inst_kungalv);

        // ==== ADDING PATIENTS ====
        await instance.addPatient(pat_gbg_kungalv_accounts, pat_gbg_kungalv, [gbg, kungalv]);
        await instance.addPatient(pat_boras_account, pat_boras, [boras]);
        await instance.addPatient(pat_kungalv_account, pat_kungalv, [kungalv]);
    });

    describe("updateEHR updates the patients EHR cid ", function () {

        it("updateEHR updates the patients EHR cid when called by permissioned personnel ", async function () {
            await instance.updateEHR(pat_gbg_kungalv, "123456", { from: doc_gbg_account });
            let cid = await instance.getEHRCid(pat_gbg_kungalv, { from: doc_gbg_account });
            assert.deepEqual("123456", cid);

        });

        it("updateEHR throws an error when called by an unauthorized actor ", async function () {
            let e;
            let cid;
            try {
                // this throws an error.
                await instance.updateEHR(pat_boras, "0", { from: doc_gbg_account });
                // this should never be run, so cid will remain undefined. 
                cid = await instance.getEHRCid(pat_boras, { from: pat_boras_account });
            } catch (err) {
                e = err;
            }
            assert.notEqual(e, undefined); // e will be === err, so not undefined. 
            assert.strictEqual(cid, undefined); // cid will never be assigned, so it is undefined. 
        });


    });

    describe("getEHRCid retrieves the cid conected to the latest EHR update", function () {

        it("getEHRCid retrieves the latest cid when called by the patient", async function () {
            let cid = await instance.getEHRCid(pat_gbg_kungalv, { from: pat_gbg_kungalv_accounts });
            await instance.updateEHR(pat_gbg_kungalv, "678910", { from: doc_gbg_account });
            let newcid = await instance.getEHRCid(pat_gbg_kungalv, { from: pat_gbg_kungalv_accounts });
            assert.deepEqual("678910", newcid);
            assert.notEqual(cid, newcid);
        });

        it("getEHRCid retrieves the latest cid when called by a permitioned personnel", async function () {
            await instance.updateEHR(pat_boras, "3456789", { from: doc_boras_account });
            let newcid = await instance.getEHRCid(pat_boras, { from: doc_boras_account });
            assert.deepEqual("3456789", newcid);
        });

        it("getEHRCid throws an error when called by an unauthorized actor ", async function () {
            let e;
            let cid;
            try {
                // this runs fine. 
                await instance.updateEHR(pat_boras, "0", { from: doc_boras_account });
                // this throws an error. 
                cid = await instance.getEHRCid(pat_boras, { from: doc_gbg_account });
            } catch (err) {
                e = err;
            }
            assert.notEqual(e, undefined); // e will be === err, so not undefined. 
            assert.strictEqual(cid, undefined); // cid will never be assigned, so it is undefined. 
        });

    });


    describe("hasPermission returns the correct value", function () {
        it("hasPermission returns true for the patient itself", async function () {
            let res = await instance.hasPermission(pat_boras, { from: pat_boras_account });
            assert.ok(res);
        });

        it("hasPermission returns true for a doctor within a permissioned region", async function () {
            let res = await instance.hasPermission(pat_boras, { from: doc_boras_account });
            assert.ok(res);
        });

        it("hasPermission returns false for a sender who does not belong to a permissioned region", async function () {
            let res = await instance.hasPermission(pat_boras, { from: doc_gbg_account });
            assert.strictEqual(res, false);
        });
    });

    describe("getPermissionedRegion returns the correct result", function () {
        it("getPermissionedRegions returns the correct array of regions when called by the patient", async function () {
            let res = await instance.getPermissionedRegions(pat_gbg_kungalv, { from: pat_gbg_kungalv_accounts });
            assert.ok(res);
        });


        it("getPermissionnedRegions throws an error when called by anybody else but the patient", async function () {
            let e;
            try {
                await instance.getPermissionedRegions(pat_gbg_kungalv, { from: doc_gbg_account });
            } catch (error) {
                e = error;
            }
            assert.notEqual(e, undefined);
        });
    });


    describe("setPermissions sets the permission correctly", function () {
        it("setPermissions sets the permission array correctly when the patient removes a region", async function () {
            let arr = [gbg];
            await instance.setPermissions(pat_gbg_kungalv, arr, { from: pat_gbg_kungalv_accounts });
            let res = await instance.getPermissionedRegions(pat_gbg_kungalv, { from: pat_gbg_kungalv_accounts });
            assert.deepEqual(res, arr);
        });


        it("setPermissions sets the permission array correctly when the patient adds a region", async function () {
            let arr = await instance.getPermissionedRegions(pat_boras, { from: pat_boras_account });
            arr = Object.assign([], arr); //assign the contents of arr into the empty array
            arr.push(kungalv); // add kungalv to the list of permissioned regions 
            await instance.setPermissions(pat_boras, arr, { from: pat_boras_account });
            let res = await instance.getPermissionedRegions(pat_boras, { from: pat_boras_account });
            assert.deepEqual(res, arr);
        });

        it("setPermissions throws an error when anyone other than the patient invokes it", async function() {
            let e;
            try {
                await instance.setPermissions(pat_boras, [gbg], { from: doc_boras_account });
            } catch (err) {
                e = err;
            }
            assert.notEqual(e, undefined);
        });
    });

})