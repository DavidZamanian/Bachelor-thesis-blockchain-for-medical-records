import React, {Component} from "react";
import Block4EHR from "../../../build/contracts/Block4EHR.json";
import getWeb3 from "./getWeb3.js";

class ChainConnection extends Component {
    state = { web3: null, accounts: null, contract: null };

    componentDidMount = async () => {
        try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Block4EHR.networks[networkId];
        const instance = new web3.eth.Contract(
            Block4EHR.abi,
            deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state. 
        this.setState({ web3, accounts, contract: instance });
        } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
        }
    };

    

}