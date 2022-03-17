/**
 * Error to be upon problems with resolving CID in contact with web3.storage. 
 * Will most likely be due to incorrect CID, but may also be due to server errors. 
 * The @msg parameter specifies the server-side response. 
 * 
 * @author Hampus Jernkrook
 */
export default class CouldNotResolveCidError extends Error {
    /**
     * 
     * @param {String} msg - msg from the error returned from the request to the server.  
     */
    constructor(msg) {
        super(`Could not resolve content at the given CID. Check that the CID is correct. Server responded with ${msg}.`);
    }
}