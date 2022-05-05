/**
 * Error to be used when the fetching of keys from firebase fails.
 * The @msg parameter specifies the error that was thrown.
 * 
 * @author Christopher Molin
 */
 export default class FetchKeyError extends Error {
    /**
     * 
     * @param {String} msg - error message thrown
     */
    constructor(msg) {
        super(`Error while attempting to fetch key from firebase: ${msg}`);
    }
}