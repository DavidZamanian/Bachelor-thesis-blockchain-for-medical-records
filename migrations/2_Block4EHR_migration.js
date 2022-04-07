const Block4EHR = artifacts.require("Block4EHR");

/**
 * Script for deploying the smart contract Block4EHR 
 * together with a few initialized objects to the blockchain.
 * This is hard-coded based on the database elements. 
 * @param {*} deployer
 * @param {*} network
 * @param {*} accounts
 *
 * @author Hampus Jernkrook
 * 
 * TODO:
 * - clean up comments at the end of the file.
 * - add additional objects if needed. 
 */
module.exports = function (deployer, network, accounts) {
  deployer.deploy(Block4EHR).then(async () => {
    let instance = await Block4EHR.deployed();

    // ADDING ALL OBJECTS TO HAVE SOME USERS TO TEST AROUND WIT:
    // We note down which region each object belongs to, to reason about 
    // who has what access permissions. 

    // ==== ADDING REGIONS ====
    await instance.addRegion("1", "Stockholm");
    await instance.addRegion("2", "Uppsala");
    await instance.addRegion("3", "Sörmland");

    // ==== ADDING INSTITUTIONS ====
    // FORM: <id, name, region_id>
    // region 1
    await instance.addHealthcareInst("2", "Liljeholmskajens vårdcentral", "1");
    await instance.addHealthcareInst("3", "Segeltorps vårdcentral", "1");
    // region 2
    await instance.addHealthcareInst("4", "Gränbystadens vårdcentral", "2");
    // region 3
    await instance.addHealthcareInst("5", "Jordbro vårdcentral", "3");

    // ==== ADDING MEDICAL PERSONNEL ====
    // FORM: <account, id, institution_id>
    // region 1
    await instance.addMedicalPersonnel(accounts[1], "7403191234", "2"); // works for Liljeholmskajens vårdcentral
    await instance.addMedicalPersonnel(accounts[2], "8701104455", "3"); // works for Segeltorps vårdcentral
    // region 2
    await instance.addMedicalPersonnel(accounts[3], "9711021234", "4"); // works for Gränbystadens vårdcentral
    // no doctor at institution 5, region 3: jordbro vårdcentral.

    // ==== ADDING PATIENTS ====
    // FORM: <account, id, permissioned_regions>
    // region 1
    await instance.addPatient(accounts[9], "9801011111", ["1"]); // doctors with accounts [1, 2] can access this one's EHR. 
    // region 2
    await instance.addPatient(accounts[8], "6503036767", ["2"]); // doctor with accounts [3] can access this one's EHR. 
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
/* ILLUSTRATING HOW TO GET THE LIST OF REGIONS FROM THE CHAIN
AND HOW TO ACCESS THEIR ID AND NAME:

truffle(develop)> let instance = await Block4EHR.deployed();
undefined
truffle(develop)> let regions = await instance.getRegions();
undefined
truffle(develop)> regions
[
  [ '1', 'Stockholm', id: '1', name: 'Stockholm' ],
  [ '2', 'Uppsala', id: '2', name: 'Uppsala' ],
  [ '3', 'Sörmland', id: '3', name: 'Sörmland' ]
]
truffle(develop)> regions[0]
[ '1', 'Stockholm', id: '1', name: 'Stockholm' ]
truffle(develop)> regions[0].id
'1'
truffle(develop)> regions[0].name
'Stockholm'
truffle(develop)> 

*/