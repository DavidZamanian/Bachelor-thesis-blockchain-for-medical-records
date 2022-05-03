import Block4EHR from "../../../build/contracts/Block4EHR.json";
import getWeb3 from "./getWeb3";
import ChainOperationDeniedError from "./chainOperationDeniedError";
import ChainConnectionError from "./chainConnectionError";

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
   * Checks it the method invoker has permission to 
   * access the given patient's EHR.
   * @param {String} patientId The id of the patient to check permision against. 
   * @returns {Promise<boolean>} true iff the invoker is permissioned by the given patient. 
   * @author Hampus Jernkrook
   */
  async hasPermission(patientId) {
    const { accounts, contract } = this.state;

    let res = false;

    try{
      res = await contract.methods
      .hasPermission(patientId)
      .call({ from: accounts[0] });
    }catch(e){
      // Do something if this fails.
      console.warn(e);
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
    try {
      const arr = await contract.methods
      .getPermissionedRegions(patientId)
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
    try {
      const cid = await contract.methods
          .getEHRCid(patientId)
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
    try {
      const { accounts, contract } = this.state;
      await contract.methods
        .updateEHR(patientId, cid)
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
    try {
      const { accounts, contract } = this.state;
      await contract.methods
          .setPermissions(patientId, regions)
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
    try {
      const { accounts, contract } = this.state;
      const regions = await contract.methods
        .getRegions()
        .call({ from: accounts[0] });
      return regions;
    } catch (err) {
      throw new ChainConnectionError(err.message);
    }
  }
}
