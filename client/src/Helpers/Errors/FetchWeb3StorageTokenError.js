/**
 * Error to be used when the fetching of Web3Storage token fails.
 * The @msg parameter specifies the error that was thrown by firebase.
 * 
 * @author Christopher Molin
 */
 export default class FetchWeb3StorageTokenError extends Error {
    /**
     * 
     * @param {String} msg - error message thrown by firebase
     */
    constructor(msg) {
        super(`Error while attempting to fetch the Web3Storage-token: ${msg}`);
    }
}