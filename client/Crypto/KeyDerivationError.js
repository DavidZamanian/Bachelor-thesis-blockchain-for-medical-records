/**
 * Exception related to any error thrown during derivation of keys.
 * @author Christopher Molin
 */
 export default class KeyDerivationError extends Error {
    constructor(msg) {
        super(msg);
    }
}