/**
 * This file is completely copy-pasted from the client/src/getWeb3.js file
 * provided by the truffle box "react" (unboxed via 'truffle unbox react').
 * Suggested by youtuber EatTheBlocks in https://www.youtube.com/watch?v=LzdMosLzj80
 * for integrating with metamask. 
 * 
 * TODO: remove the console.log:s
 * 
 * Copy-pasted and used by @author Hampus Jernkrook
 */

import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      console.log("ADDING LISTENER")
      // Modern dapp browsers...
      if (window.ethereum) {
        console.log("IN WINDOW.ETHEREUM")
        const web3 = new Web3(window.ethereum);
        try {
          console.log("WAITING FOR USER ACCEPTING")
          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;