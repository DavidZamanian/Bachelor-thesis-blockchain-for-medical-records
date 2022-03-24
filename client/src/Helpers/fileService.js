import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js'




export default class FileService{

   

    
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
     * @returns {Promise<String>} cid -- The Web3Storage CID to the root folder
     * @author @Chrimle
     */
     async uploadFiles(files){

        //cid = null;
        //let err = null;
        /*
        this.client.put(files)
            .then((value) => {
                cid = value;
            })
            .catch((e) =>{
                err = e;
            })
        */
       try {
        return await this.client.put(files);
       }
       catch(e){
           throw e;
       }

    }
    

    /**
     * Fetches a Web3Storage file, and returns fhe content
     * @param  {String} cid -- Only the random part of the full address
     * @param  {String} fileName -- Only the unique name of the file to read, exclude file ending
     * @returns {String} content 
     * @author Kamil Kiełczewski https://stackoverflow.com/a/55784549/5424535
     */
    static async fetchFile(cid, fileName){

        let url = (`https://${cid}.ipfs.dweb.link/${fileName}.json`);

        let content = null;

        try {
            content = (await (await fetch(url)).text());
        } catch(e) {
            console.log('error');
            throw e;
        }
        
        return content
    }

}
