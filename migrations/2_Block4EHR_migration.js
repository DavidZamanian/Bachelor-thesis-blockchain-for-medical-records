const Block4EHR = artifacts.require("Block4EHR");
const crypt = require("../client/Crypto/crypt");

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
    // hash of id: 011558ef6aae0f28d4ee91a60e78a7acb12f1ad17683cfcac8a79f9a575c203b
    const daddy_id = await crypt.hashString("9801011111");
    await instance.addPatient(accounts[9], daddy_id, []);
    
    // region 2
    
    // doctor with account [3] can access this one's EHR.
    // mail: slick.rick@gmail.com
    // hash of id: f632b8292dc7de720171aa1f8e3b777dcff0aa0ddc5babd25fc9713abe7a1e71
    const slick_id = await crypt.hashString("6503036767"); 
    await instance.addPatient(accounts[8], slick_id, ["2"]);  
  });
};