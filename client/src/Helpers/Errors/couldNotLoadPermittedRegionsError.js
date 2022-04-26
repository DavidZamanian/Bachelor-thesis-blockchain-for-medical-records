export default class CouldNotLoadPermittedRegionsError extends Error {
    constructor(msg) {
        super(`Failed to load permission settings. Error thrown with message ${msg}`);
    }
}