# Blockchain-for-medical-records

## INSTALLATION:

### Start by installing expo and NodeJS (automatically includes NPM in the installation) on your machine

1. Install NodeJS: https://nodejs.org/en/

`cd` to the root folder of the project

2. Install expo: `npm install --global expo-cli` (Need to install NodeJS first)
3. run `npm install` (or `npm i` for short)


### Setting up the server:

Install express server with: `npm i express`

## RUNNING THE SERVER

Run `npm start` in a terminal to start the express server

The server is now running on port 4000, go to http://localhost:4000/api to see messages from the server

## RUNNING THE WEB-APPLICATION

In a separate terminal window, cd to the `client` folder

In your terminal: run `expo web`

You should now be able to view the application in your browser, at http://localhost:19006/.

### Using the web-application

In order to log-in, you need a valid email and password. These are found on Firebase: https://firebase.google.com/

There are 2 types of users: patients and doctors. The emails should give a hint as to which belong to doctors.

Currently, there are no further requirements. If you wish, you can check out uploaded files on Web3Storage to get the CID to look up on IPFS.
However, for the time being, the IPFS-link to the uploaded files will be provided in the web-browser console during development.
