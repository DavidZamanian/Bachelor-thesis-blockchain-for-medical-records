import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js'

export default class FileService{

    client;

    
    /**
     * Constructs a FileService object with the API Token to Web3Storage
     * @param  {String} apiToken
     * @author @Chrimle
     */
    constructor(apiToken){
        this.client = new Web3Storage({ token: apiToken});
    }


    /**
     * Creates a JSON-file with the content and name specified
     * @param  {String} content
     * @param  {String} fileName
     * @returns {File} -- file object with the name and content provided
     * @author @Chrimle
     */
    static createJSONFile( content, fileName ){
        
        return new File([content], fileName+'.json', { type: 'text/json' });
    }

    
    /**
     * Uploads file(s) to Web3Storage and returns the CID for the root folder
     * @param  {Array<File>} files
     * @returns {String} cid -- The Web3Storage CID to the root folder
     * @author @Chrimle
     */
    uploadFiles(files){

        let cid = null;
        let err = null;
        this.client.put(files)
            .then((value) => {
                cid = value;
            })
            .catch((e) =>{
                err = e;
            })
        if (err !== null){
            throw err
        }
        return cid;
    }
    
}
