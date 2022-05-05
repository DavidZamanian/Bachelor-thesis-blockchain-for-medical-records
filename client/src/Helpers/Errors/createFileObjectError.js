/**
 * Error to be used when the attempted file creation failed.
 * The @msg parameter specifies the error that was thrown by the File constructor.
 * 
 * @author Christopher Molin
 */
export default class CreateFileObjectError extends Error {
    /**
     * 
     * @param {String} msg - error message thrown by File
     */
    constructor(msg) {
        super(`Error while creating the File Object: ${msg}`);
    }
}