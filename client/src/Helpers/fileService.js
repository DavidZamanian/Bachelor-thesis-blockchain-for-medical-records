import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import CreateFileObjectError from './Errors/createFileObjectError';
import FetchFileContentError from './Errors/FetchFileContentError';
import UploadFileError from './Errors/uploadFileError';
import CouldNotResolveCidError from './Errors/couldNotResolveCidError';
import DownloadError from './Errors/downloadError';

export default class FileService{
    
    /**
     * Constructs a FileService object with the API Token to Web3Storage
     * @param  {String} apiToken
     * @author Christopher Molin
     */
    constructor(apiToken){
        this.client = new Web3Storage({ token: apiToken});
    }


    /**
     * Creates a JSON-file with the content and name specified
     * @param  {String} content
     * @param  {String} fileName
     * @returns {Promise<File>} file object with the name and content provided
     * @throws {CreateFileObjectError}
     * @author Christopher Molin
     */
    static async createJSONFile( content, fileName ){
        try{
            return new File([content], fileName+'.json', { type: 'text/json' });
        }
        catch(e){
            throw CreateFileObjectError(e);
        }
        
    }

    
    /**
     * Uploads file(s) to Web3Storage and returns the CID for the root folder
     * @param  {Array<File>} files The files to be uploaded
     * @returns {Promise<String>} The IPFS CID to the root folder
     * @throws {UploadFileError}
     * @author Christopher Molin
     */
     async uploadFiles(files){

       try {
        return await this.client.put(files);
       }
       catch(e){
           throw UploadFileError(e);
       }

    }
    

    /**
     * Fetches a Web3Storage file, and returns fhe content
     * @param  {String} cid Only the random part of the full address
     * @param  {String} fileName The name and filetype of the file
     * @returns {Promise<string>} content 
     * @author Christopher Molin 
     * - Inspiration: Kamil Kiełczewski https://stackoverflow.com/a/55784549/5424535
     */
    static async fetchFileContent(cid, fileName){

        let url = (`https://${cid}.ipfs.dweb.link/${fileName}`);
        
        try{
            let result = await fetch(url);
            let content = await result.text();
            return content;
        }
        catch(e){
            throw FetchFileContentError(e);
        }
        
    }

    /**
     * Fetches all EHR files
     * @param  {String} cid
     * @param {boolean} [getNextEHRIndex]
     * @returns {Promise<{files: Array<File>, index?: number}>} Array with Files and the next index for EHR if upload is true
     * @author Christopher Molin
     */
    async fetchEHRFiles(cid, getNextEHRIndex){

        let results = [];

        // Get prescriptions
        let content = await FileService.fetchFileContent(cid, "prescriptions.json");
        let file = new File([content], "prescriptions.json", { type: 'text/json' });
        results.push(file);

        // get diagnoses
        content = await FileService.fetchFileContent(cid, "diagnoses.json");
        file = new File([content], "diagnoses.json", { type: 'text/json' });
        results.push(file);

        // LOOP: get EHR_index
        let index = 0;
        let keepSearching = true;
        do {
            try{
                let fileName = "EHR_"+index+".json"
                let content = await FileService.fetchFileContent(cid, fileName);

                if (content.search("ipfs resolve") == -1){
                    let file = new File([content], fileName, { type: 'text/json' });
                    results.push(file);  
                    index += 1;  
                }else{
                    keepSearching = false
                }
            }
            catch (e){
                keepSearching = false
            }
        } while(keepSearching)

        if (getNextEHRIndex){
            return {files: results, index: index};
        }
        else{
            return {files: results};
        }
        
    }



     /**
     * Method to get the files' urls, where they can be accesses via an ipfs web interface. 
     * Inspired by https://docs.web3.storage/how-tos/retrieve/#using-the-client-libraries 
     * and https://docs.web3.storage/reference/js-client-library/#retrieve-files. 
     * 
     * @param {String} cid content identifier for the file to be retrieved
     * @returns {Promise<Array<String>>} Array of urls of the files to be retrieved 
     */
      async retrieveFileNames(cid) { 
        console.log("Waiting for names")
        const res = await this.client.get(cid);
        const files = await res.files(); // Web3File[]
        console.log("Got file names!")
 
        let fileNames = [];
        for (const file of files) {
            fileNames.push(file.name);
            //console.log(`${file.cid} ${file.name} ${file.size}`)
        }

        return fileNames;
    }


    /**
     * Method to get urls in the right format. The path is on the form <cid>/<dir>/<file>. 
     * This method returns the <dir>/<file>-part. 
     * @param {String} path - Path to file 
     * @param {String} cid - content indentifier to the content archive where the files resides. 
     * @returns the path with the prefix cid removed.
     *
     * @author Hampus Jernkrook
     */
     removeCidPrefix(path, cid) {
        path = path.replace(cid, "");
        return path;
    }

}
