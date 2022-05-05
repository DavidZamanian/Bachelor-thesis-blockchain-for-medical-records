/**
 * Exception related to any error thrown during decryption of keys.
 * @author Christopher Molin
 */
 export default class KeyDecryptionError extends Error {
    constructor(msg) {
        super(msg);
    }
}