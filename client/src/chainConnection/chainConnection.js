import Block4EHR from "../../../build/contracts/Block4EHR.json";
import getWeb3 from "./getWeb3";
import ChainOperationDeniedError from "./chainOperationDeniedError";
import ChainConnectionError from "./chainConnectionError";
import * as crypt from "../../Crypto/crypt";

/**
 * Handles the connection to the smart contract Block4EHR on the blockchain. 
 * Is used to both integrate with metamask and acts as an intermediate
 * against contract calls. 
 * 
 * TODO: remove console.log:s. Only there for dev purposes. 
 * 
 * @author Hampus Jernkrook
 */
export default class ChainConnection {
  constructor() {
    this.state = {
      web3: null, // Web3 instance
      accounts: null, // Array of ethereum accounts
      contract: null, // Contract instance
    };
  }

  setState(state) {
    this.state = state;
  }

  /**
   * Initializes the state variables of the `ChainConnection` instance. 
   * This method is a slightly modified version of the client/src/App.js file
   * provided by the truffle box "react". 
   * @author Hampus Jernkrook
   * 
   * TODO: remove the console.log:s when done developing. 
   */
  async init() {
    console.log("Starting init()");
    try {
      console.log("getting the web3 instance...");
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log(`web3 instance is ${web3}`);

      console.log("getting ethereum accounts...");
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      console.log(accounts); //TODO remove

      console.log("getting the contract instance...");
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Block4EHR.networks[networkId];
      const instance = new web3.eth.Contract(
        Block4EHR.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log("SETTING THE STATE");
      // Set web3, accounts, and contract to the state.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(`FATAL: Failed to connect to the blockchain system.\n`+
        `- If not already connected, you need to allow Metamask to connect to the site.\n` + 
        `- Click OK below to reload the page. Metamask will prompt you to connect.`
      );
      window.location.reload(); // reload the page. 
    }
    console.log("Done init()");
  }

  /**
   * Checks if the method invoker has permission to 
   * access the given patient's EHR.
   * @param {String} patientId The id of the patient to check permision against. 
   * @returns {Promise<boolean>} true if the invoker is permissioned by the given patient. 
   * @throws {ChainConnectionError} if the operation fialed, most likely due to a network error.
   * @author Hampus Jernkrook
   */
  async hasPermission(patientId) {
    const { accounts, contract } = this.state;

    let res = false;
    const hashed_id = await crypt.hashString(patientId);

    try{
      res = await contract.methods
      .hasPermission(hashed_id)
      .call({ from: accounts[0] });
    } catch(err) {
      throw new ChainConnectionError(err.message);
    }
    
    return res;
  }

  /**
   * Get the list of permissioned regions, for the given patient. 
   * @param {String} patientId The id of the patient to retrieve permissioned regions for. 
   * @returns {Promise<Array<String>>} The list of permissioned regions, in the form of region id:s.
   * @throws {ChainOperationDeniedError} if the operation failed, most likely due to the invoker not
   *  having permission to invoke it. 
   * @author Hampus Jernkrook
   */
  async getPermissionedRegions(patientId) {
    const { accounts, contract } = this.state;
    const hashed_id = await crypt.hashString(patientId);
    try {
      const arr = await contract.methods
      .getPermissionedRegions(hashed_id)
      .call({ from: accounts[0] });
      return arr;
    } catch (err) {
      throw new ChainOperationDeniedError(err.message);
    }
  }

  /**
   * Get the CID of the given patient's EHR, stored on the chain. 
   * @param {String} patientId The id of the patient to retrieve the CID of.
   * @returns {Promise<String>} The CID of the given patient's EHR. 
   * @throws {ChainOperationDeniedError} if the operation failed, most likely due to the invoker not
   *  having permission to invoke it. 
   * @author Hampus Jernkrook
   */
  async getEHRCid(patientId) {
    const { accounts, contract } = this.state;
    const hashed_id = await crypt.hashString(patientId);
    try {
      const cid = await contract.methods
          .getEHRCid(hashed_id)
          .call({ from: accounts[0] });
      return cid;
    } catch (err) {
      throw new ChainOperationDeniedError(err.message);
    }
  }

  /**
   * Set the CID of the given patient on the chain. 
   * @param {String} patientId The id of the patient to set the CID for. 
   * @param {String} cid The value of CID to be set.
   * @throws {ChainOperationDeniedError} if the operation failed, most likely due to the invoker not
   *  having permission to invoke it. 
   * @author Hampus Jernkrook
   */
  async updateEHR(patientId, cid) {
    const { accounts, contract } = this.state;
    const hashed_id = await crypt.hashString(patientId);
    try {
      await contract.methods
        .updateEHR(hashed_id, cid)
        .send({ from: accounts[0] });
    } catch (err) {
      throw new ChainOperationDeniedError(err.message);
    }
  }

  /**
   * Set the list of permissioned regions for the given patient. 
   * @param {String} patientId The id of the patient to set the list of permissions for. 
   * @param {Array<String>} regions Array of region id:s that the patient have authorized permission to. 
   * @throws {ChainOperationDeniedError} if the operation failed, most likely due to the invoker not
   *  having permission to invoke it. 
   * @author Hampus Jernkrook 
   */
  async setPermissions(patientId, regions) {
    const { accounts, contract } = this.state;
    const hashed_id = await crypt.hashString(patientId);
    try {
      await contract.methods
          .setPermissions(hashed_id, regions)
          .send({ from: accounts[0] });
    } catch (err) {
      throw new ChainOperationDeniedError(err.message);
    }
  }

  /**
   * Get the list of all regions on the chain.
   * @returns {Promise<Array<Array<string>>>} Array of Region objects, with properties `id` and `name`. 
   * @throws {ChainConnectionError} if the operation failed. In this case, it is most likely
   *  due to a network error. 
   * @author Hampus Jernkrook
   */
  async getAllRegions() {
    const { accounts, contract } = this.state;
    try {
      const regions = await contract.methods
        .getRegions()
        .call({ from: accounts[0] });
      return regions;
    } catch (err) {
      throw new ChainConnectionError(err.message);
    }
  }

  /**
   * Get all recorded personnel operating within a given region. 
   * @param {String} regionId The region to return all personnel operating within. 
   * @returns {Array<String>} An array of personnel ids.
   * @throws {ChainConnectionError} if the operation failed. In this case, it is most likely
   *  due to a network error. 
   * @author Hampus Jernkrook
   */
  async getRegionPersonnel(regionId) {
    const { accounts, contract } = this.state;
    let personnel;
    try {
      personnel = await contract.methods
        .getRegionPersonnel(regionId)
        .call({ from : accounts[0] });
    } catch (err) {
      throw new ChainConnectionError(err.message);
    }
    return personnel.map(p => p.id);
  }

  /**
   * Get the name of a given healthcare institution. 
   * @param {String} institutionId The id of the institution that the name should be returned for. 
   * @returns {String} The name of the instituion with the given id.
   * @throws {ChainConnectionError} if the operation failed. In this case, it is most likely
   *  due to a network error.
   * @author Hampus Jernkrook
   */
  async getInstitutionName(institutionId) {
    const { accounts, contract } = this.state;
    try {
      const name = await contract.methods
        .getInstitutionName(institutionId)
        .call({ from: accounts[0] });
      return name;
    } catch (err) {
      throw new ChainConnectionError(err.message);
    }
  }

  /**
   * Get the healthcare institution a given medical personell works at. 
   * @param {String} medicalPersonnelId The id of the medical Personell. 
   * @returns {Promise<Object>} The instituion object the given medical personell works at, with properties "id", "name", Region(object with it's own properties).
   * @throws {ChainConnectionError} if the operation failed. In this case, it is most likely
   *  due to a network error.
   * @author Edenia Isaac
   */
  async getHealthCareInstitution(medicalPersonnelId) {
    const { accounts, contract } = this.state;
    try {
      const healthcareInst = await contract.methods
        .getHealthCareInstitution(medicalPersonnelId)
        .call({ from: accounts[0]});
      return healthcareInst;
    } catch (err){
      throw new ChainConnectionError(err.message);
    }
  }


}
