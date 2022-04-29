/**
 * Error for use upon blockchain errors arising from network or contract failure.
 * @author Hampus Jernkrook
 */
export default class ChainConnectionError extends Error {
    constructor(msg) {
        super(msg);
    }
}