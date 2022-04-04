# Blockchain-for-medical-records

## INSTALLATION:

### Start by installing expo and NodeJS (automatically includes NPM in the installation) on your machine

1. Install NodeJS: https://nodejs.org/en/

`cd` to the root folder of the project

2. Install expo: `npm install --global expo-cli` (Need to install NodeJS first)
3. run `npm install` (or `npm i` for short)


### Setting up the server:

Install express server with: `npm i express`

### Installing truffle
Run `npm install -g truffle` in your terminal. 

### Installing and setting up Ganache
1. Download Ganache as described here: https://trufflesuite.com/docs/ganache/quickstart.html 
1. Launch Ganache
1. Create a new workspace. Name it whatever you wish. Before saving the workspace, be sure to go to `SERVER` and change `PORT NUMBER` to 8545. Also go to `ACCOUNTS & KEYS` and set the default number of Ether per account superhigh, if you wish to be sure that you will never run out of gas. 

### Installing Metamask
1. Have either Chrome or Firefox installed. Use either as your platform for running the website. 
1. In your browser, install Metamask either in Chrome: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn or in Firefox: https://addons.mozilla.org/sv-SE/firefox/addon/ether-metamask/.
1. Go through the Metamask setup steps. Select `IMPORT WALLET` and input the 12-word string displayed right above your accounts in Ganache. 
1. Once Metamask is setup, go to Setting > Advanced, and enable `Show test networks`. Then select `Localhost 8545` as the network to connect to. 
1. Account 1 in Metamask will already be initialized to Account 0 from Ganache. Add more accounts by clicking on your profile pic > import account, and then paste in the private key of the account you wish to import from Ganache. You find the private key by clicking the key to the far right in Ganache's Account overview. 
You should add all 10 accounts in Ganache to your metamask. Account $i$ will correspond to accounts[$i-1$] (i.e. the account in Ganache with index $i-1$).

## SETTING UP THE BLOCKCHAIN
1. Launch Ganache. 
1. If you wish, run `truffle --config truffle-config.cjs  compile` to compile the smart contract. This is also done by the next step. 
1. Run `truffle --config truffle-config.cjs migrate`. This will deploy the smart contract on the local blockchain. This will cost some gas and increment the block count in Ganache. The smart contract will now be live and populated by the objects initialized in the migrations script `2_Block4EHR_migration.js`. 

## RUNNING THE SERVER

Run `npm start` in a terminal to start the express server

The server is now running on port 4000, go to http://localhost:4000/api to see messages from the server

## RUNNING THE WEB-APPLICATION

In a separate terminal window, cd to the `client` folder

In your terminal: run `expo web`

You should now be able to view the application in your browser, at http://localhost:19006/.

### Using the web-application

#### Logging in
In order to log-in, you need a valid email and password. These are found on Firebase: https://firebase.google.com/

There are 2 types of users: patients and doctors. The emails should give a hint as to which belong to doctors.

#### Connecting to metamask
First, make sure you are logged in to metamask in your browser. 
Upon loading the website, if you have not previously connected any of your metamask-connected accounts to the website, metamask should automatically prompt you to connect one or more accounts. Connect the accounts you wish to use with the website. You can only use one account per session (the currently active one). 

#### Additional requirements
Currently, there are no further requirements. If you wish, you can check out uploaded files on Web3Storage to get the CID to look up on IPFS.
However, for the time being, the IPFS-link to the uploaded files will be provided in the web-browser console during development.

### TESTING THE CODE
#### Normal src code testing:
Run `npm test`. This does not include the tests of the smart contract. 

#### Smart contract testing:
Launch Ganache, or temporarily uncomment the develop network settings in `truffle-config.js` (lines 44-47) (restore these once the tests are run). Run `'truffle --config truffle-config.cjs test truffle_test/test/testBlock4EHR.js`. This does not include any other tests than the smart contract functions.


#### Playing around in Truffle
You can play around with the contract in truffle should you wish. If so, then do this: 
1. Run `truffle --config truffle-config.cjs compile`.
1. Run `truffle --config truffle-config.cjs develop`. This will start a local test environment. 
1. Run `migrate`. This will deploy the smart contract. 
1. See `2_Block4EHR_migration.js` for some comments showing how to use the testing environment. 
