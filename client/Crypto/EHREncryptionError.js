/**
 * Exception related to any error thrown during encryption of EHRs.
 * @author Christopher Molin
 */
 export default class EHREncryptionError extends Error {
    constructor(msg) {
        super(msg);
    }
}