import ChainConnection from "./chainConnection";

/**
 * Class for initializing a single ChainConnection object. 
 * @author Hampus Jernkrook
 */
export default class ChainConnectionFactory {
    static _chainConnection = null; // the single instance shared by all callers. 

    /**
     * Initializes a ChainConnection instance and sets all state variables iff
     * no instance has been previously initialized. Else returns the previously
     * initialized instance. 
     * @returns {Promise<ChainConnection>} instance with state variables set. 
     */
    static async getChainConnection() {
        // singleton ChainConnection object. Do not init if already initialized.
        if (!this._chainConnection) { 
            console.log("Initializing ChainConnection...");
            this._chainConnection = new ChainConnection();
            await this._chainConnection.init();
            console.log("ChainConnection Initialized.");
            return this._chainConnection;
        }
    }
}