const Block4EHR = artifacts.require("Block4EHR");
//import {Block4EHR} from "../contracts/Block4EHR.sol";

const inst_gbg = "i_gbg";
const inst_boras = "i_boras";
const inst_kungalv = "i_kungalv";
const doc_gbg = "d_gbg";
const doc_kungalv = "d_kungalv";
const doc_boras = "d_boras";


contract("Block4EHR", accounts => {
    let instance;

    before(async () => {
        instance = await Block4EHR.deployed();

        // ==== ADDING INSTITUTIONS ====
        await instance.addHealthcareInst("i_gbg", "gbg1", "gbg");
        await instance.addHealthcareInst("i_boras", "b1", "boras");
        await instance.addHealthcareInst("i_kungalv", "k1", "kungalv");
    
        // ==== ADDING MEDICAL PERSONNEL ====
        await instance.addMedicalPersonnel(accounts[1], "d_gbg", "i_gbg");
        await instance.addMedicalPersonnel(accounts[2], "d_boras", "i_boras");
        await instance.addMedicalPersonnel(accounts[3], "d_kungalv", "i_kungalv");

        // ==== ADDING PATIENTS ====
        await instance.addPatient(accounts[9], "p_gbg_kungalv", ["gbg", "kungalv"]);
        await instance.addPatient(accounts[8], "p_boras", ["boras"]);
        await instance.addPatient(accounts[7], "p_kungalv", ["kungalv"]);
    });

    //describe("hasPermission returns the correct value", function() {
        it("hasPermission return true for the patient itself", async function() {
            let res = await instance.hasPermission("p_boras", {from: accounts[8]});
            assert.ok(res);
        });
    //});
})
/*
contract("Block4EHR", accounts => {
    
})

contract("Block4EHR", accounts => {
    
})
*/