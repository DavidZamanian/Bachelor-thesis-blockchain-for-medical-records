# Blockchain-for-medical-records

## INSTALLATIONS:

### Start by installing expo and NodeJS (automatically includes NPM in the installation) on your machine

1. Install NodeJS: https://nodejs.org/en/

cd to root folder in project

2. Install expo (Need to install NodeJS first): npm install --global expo-cli
3. run 'npm install'


### Setting up the server:

Install express server with: 'npm i express'

## RUNNING THE APPLICATION

run 'npm start' in terminal to start server

The server is now running on port 4000, go to http://localhost:4000/api to see messages from the server

In a separate terminal window, cd to 'client'

In your terminal: run 'expo web'

You should now be able to view the application in your browser, at http://localhost:19006/. 

## SETTING UP YOUR API TOKEN FOR WEB3.STORAGE
1. Go to https://web3.storage/.
2. Click Login and enter the email you want to use for Web3.Storage.
3. Generate an API TOKEN.
4. Set your `WEB3STORAGE_TOKEN` environment variable as detailed below: 
 ### Setting the environment variable
1. Open `.bashrc` or  `.zshrc` (whichever shell environment you use) in Vim from your root directory (of your computer, not the repo!). 
2. At the last line, write `export WEB3STORAGE_TOKEN=<your-api-token-here>`. Note that the API TOKEN should be unquoted.
3. Check that indeed your environment variable has been set. Open a new terminal window and run `echo $WEB3STORAGE_TOKEN`. You should now see your token displayed in the terminal. 
4. DONE!

## TESTING THE APPLICATION
### Testing the source code written as ES6 modules
- Run 'npm test'
### Testing the smart contract via automatic Truffle test - as a CommonJS module
- Run 'truffle --config truffle-config.cjs test truffle_test/test/testBlock4EHR.js'
### Testing the smart contract by playing around in Truffle
1. Run 'truffle --config truffle-config.cjs compile' to compile all contracts. 
2. Run 'truffle --config truffle-config.cjs develop' to set up a local test environment. 
3. Run 'migrate' to deploy the smart contract to the local environment. 
4. See comments in ./migrations/2_Block4EHR_migration.js for examples on how to play around with the functions.