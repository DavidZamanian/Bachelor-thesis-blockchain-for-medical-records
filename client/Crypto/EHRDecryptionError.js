/**
 * Exception related to any error thrown during decryption of EHRs.
 * @author Christopher Molin
 */
export default class EHRDecryptionError extends Error {
    constructor(msg) {
        super(msg);
    }
}