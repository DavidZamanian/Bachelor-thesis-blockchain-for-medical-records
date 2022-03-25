const Block4EHR = artifacts.require("Block4EHR");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Block4EHR).then( async () => {
    let instance = await Block4EHR.deployed();

    // ==== ADDING INSTITUTIONS ====
    await instance.addHealthcareInst("iy", "g", "gbg");
    await instance.addHealthcareInst("in", "b", "boras");
  
    // ==== ADDING MEDICAL PERSONNEL ====
    await instance.addMedicalPersonnel(accounts[1], "dy", "iy");
    await instance.addMedicalPersonnel(accounts[2], "dn", "in");
    

    // ==== ADDING PATIENTS ====
    await instance.addPatient(accounts[9], "p_gbg", ["gbg", "kungalv"]);
    await instance.addPatient(accounts[8], "p_boras", ["boras"]);


  });
};


/* SOME COMMANDS FOR TESTING THIS IN THE TRUFFLE COMMAND LINE:

truffle --config truffle-config.cjs compile
truffle --config truffle-config.cjs develop
migrate

let instance = await Block4EHR.deployed();

instance.medicalPersonnels(accounts[1])
instance.medicalPersonnels(accounts[2])
instance.healthcareInstitutions("iy")
instance.healthcareInstitutions("in")
instance.patients("p_gbg")
instance.patients("p_boras")

// change account and this will be denied
instance.getPermissionedRegions("p_gbg", {from: accounts[9]})
instance.getPermissionedRegions("p_boras", {from: accounts[8]})

// change account and this will be denied
instance.setPermissions("p_gbg", [ 'gbg', 'kungalv', 'skovde' ], {from: accounts[9]})
*/
