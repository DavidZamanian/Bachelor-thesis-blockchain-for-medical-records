/**
 * Exception related to any error thrown during encryption of keys.
 * @author Christopher Molin
 */
 export default class KeyEncryptionError extends Error {
    constructor(msg) {
        super(msg);
    }
}