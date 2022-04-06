import Web3 from "web3";

/*
 SOME LINKS
 https://web3js.readthedocs.io/en/v1.7.1/getting-started.html 
 https://www.dappuniversity.com/articles/blockchain-app-tutorial 
 https://www.smashingmagazine.com/2021/01/nodejs-api-ethereum-blockchain/
 https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8 
 https://medium.com/0xcode/interacting-with-smart-contracts-using-web3-js-34545a8a1ebd 
 https://medium.com/0xcode/interacting-with-smart-contracts-using-web3-js-part-ii-c1ef7566d1c5 
*/

/**
 * Class for connecting to the smart contract on the blockchain
 * and execute function calls. 
 * 
 * @author Hampus Jernkrook
 */
export default class ChainConnection {
    constructor() {
        this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    }

}