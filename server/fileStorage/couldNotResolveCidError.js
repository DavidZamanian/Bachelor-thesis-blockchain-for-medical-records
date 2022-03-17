export default class CouldNotResolveCidError extends Error {
    constructor(msg) {
        super(`Could not resolve content at the given CID. Check that the CID is correct. Server responded with ${msg}.`);
    }
}