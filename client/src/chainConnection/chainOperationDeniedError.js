/**
 * Error to be used upon operation being reverted on the blockchain. 
 * Most likely, the invoker of the functin does not have permissions to invoke it,
 * in that case.
 * 
 * @author Hampus Jernkrook
 */
export default class ChainOperationDeniedError extends Error {
    constructor(msg) {
        super(`\nOperation reverted.\n` +
        `Either you don't have permission to do this, or you lost connection to the network.\n` +
        `Error was: ${msg}\n`);
    }
}