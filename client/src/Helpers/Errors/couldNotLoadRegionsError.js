/**
 * Error to be used upon failure to load all regions from the smart contract.
 * @author Hampus Jenkrook
 */
export default class CouldNotLoadRegionsError extends Error {
    constructor(msg) {
        super(msg);
    }
}