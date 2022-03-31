import Block4EHR from "../../../build/contracts/Block4EHR.json";
import getWeb3 from "./getWeb3";

export default class ChainConnection {
  //state = { web3: null, accounts: null, contract: null };

  constructor() {
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
    };
    //this.web3 = null;
  }

  setState(state) {
    this.state = state;
    alert(state); //TODO REMOVE
  }

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
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
    console.log("Done init()");
  }

  // TODO: add error handling if the state is not set correctly
  async hasPermission(patientId) {
    const { accounts, contract } = this.state;
    const res = await contract.methods
      .hasPermission(patientId)
      .call({ from: accounts[0] });
    return res;
  }

  async getPermissionedRegions(patientId) {
    const { accounts, contract } = this.state;
    const res = await contract.methods
      .getPermissionedRegions(patientId)
      .call({ from: accounts[0] });
    return res;
  }
}
