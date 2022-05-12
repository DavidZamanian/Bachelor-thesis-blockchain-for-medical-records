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
    await instance.addRegion("4", "Östergötland");
    await instance.addRegion("5", "Jönköping");
    await instance.addRegion("6", "Kalmar");
    await instance.addRegion("7", "Gotland");
    await instance.addRegion("8", "Blekinge");
    await instance.addRegion("9", "Skåne");
    await instance.addRegion("10", "Halland");
    await instance.addRegion("11", "Västra Götaland");
    await instance.addRegion("12", "Värmland");
    await instance.addRegion("13", "Örebro");
    await instance.addRegion("14", "Västmanland");
    await instance.addRegion("15", "Dalarna");
    await instance.addRegion("16", "Gävleborg");
    await instance.addRegion("17", "Västernorrland");
    await instance.addRegion("18", "Jämtland Härjedalen");
    await instance.addRegion("19", "Västerbotten");
    await instance.addRegion("20", "Norrbotten");

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

    // works for Liljeholmskajens vårdcentral
    // mail: zoe.smith@hospital.mail.org
    await instance.addMedicalPersonnel(accounts[1], "7403191234", "2"); 
    // works for Segeltorps vårdcentral
    // mail: test@gmail.com
    //await instance.addMedicalPersonnel(accounts[2], "8701104455", "3"); 
    
    // region 2

    // works for Gränbystadens vårdcentral
    // mail: eric.anderson@hospital.mail.org
    await instance.addMedicalPersonnel(accounts[3], "9711021234", "4"); 

    // no doctor at institution 5, region 3: jordbro vårdcentral.

    // ==== ADDING PATIENTS ====
    // FORM: <account, id, permissioned_regions>

    // NO REGION

    // No doctor can access this one's EHR until permission is granted via the patient's user. 
    // mail: daddykane@gmail.com
    await instance.addPatient(accounts[9], "9801011111", []);
    
    // region 2
    
    // doctor with account [3] can access this one's EHR.
    // mail: slick.rick@gmail.com
    await instance.addPatient(accounts[8], "6503036767", ["2"]);  
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


//======= GETTING PERSONNEL FOR A GIVEN REGION ====
// get an array with each personnel defined inside an array
> let personnel1 = await instance.getRegionPersonnel('1');

// printing personnel1:
> personnel1
[
  [
    '0x60F7D8aF0251235614809989AF2ECE3B6959cde5',
    '7403191234',
    [
      '2',
      'Liljeholmskajens vårdcentral',
      [Array],
      id: '2',
      name: 'Liljeholmskajens vårdcentral',
      region: [Array]
    ],
    addr: '0x60F7D8aF0251235614809989AF2ECE3B6959cde5',
    id: '7403191234',
    healthcareInst: [
      '2',
      'Liljeholmskajens vårdcentral',
      [Array],
      id: '2',
      name: 'Liljeholmskajens vårdcentral',
      region: [Array]
    ]
  ],
  [
    '0x3726B0d9d8624b343D0fBe1084C26Bd079e46D17',
    '8701104455',
    [
      '3',
      'Segeltorps vårdcentral',
      [Array],
      id: '3',
      name: 'Segeltorps vårdcentral',
      region: [Array]
    ],
    addr: '0x3726B0d9d8624b343D0fBe1084C26Bd079e46D17',
    id: '8701104455',
    healthcareInst: [
      '3',
      'Segeltorps vårdcentral',
      [Array],
      id: '3',
      name: 'Segeltorps vårdcentral',
      region: [Array]
    ]
  ]
]

// getting the first personnel's id:
> personnel1[0].id
*/