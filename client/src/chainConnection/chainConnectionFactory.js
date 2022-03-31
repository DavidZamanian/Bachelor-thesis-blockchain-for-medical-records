import ChainConnection from "./chainConnection";

/**
 * Class for initializing a single ChainConnection object. 
 * @author Hampus Jernkrook
 */
export default class ChainConnectionFactory {
    static _chainConnection = null;

    static async getChainConnection() {
        // singleton ChainConnection object. Do not init if already initialized.
        if (!this._chainConnection) { 
            console.log("Initializing ChainConnection...");
            this._chainConnection = new ChainConnection();
            await this._chainConnection.init();
            console.log("ChainConnectin Initialized.");
            return this._chainConnection;
        }
    }
}