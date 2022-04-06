export default class ChainOperationDeniedError extends Error {
    constructor(msg) {
        super(`\nOperation reverted.\n` +
        `Either you don't have permission to do this, or you lost connection to the network.\n` +
        `Error was: ${msg}\n`);
    }
}