/**
 * Error to be used when downloading a file from a url throws an error. 
 * The @msg parameter specifies the error that was thrown upon the http request. 
 * 
 * @author Hampus Jernkrook
 */
export default class DownloadError extends Error {
    /**
     * 
     * @param {String} msg - error message thrown upon the http request triggering 
     * the error.  
     */
    constructor(msg) {
        super(`Error occurred while downloading a file. Error was: ${msg}`);
    }
}