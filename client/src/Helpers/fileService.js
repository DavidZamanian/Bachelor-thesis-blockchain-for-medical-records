import { Web3Storage, File} from 'web3.storage'
import CreateFileObjectError from './Errors/createFileObjectError';
import FetchFileContentError from './Errors/FetchFileContentError';
import UploadFileError from './Errors/uploadFileError';
import CouldNotResolveCidError from './Errors/couldNotResolveCidError';
import DownloadError from './Errors/downloadError';

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
     * @throws {CreateFileObjectError}
     * @author @Chrimle
     */
    static createJSONFile( content, fileName ){
        try{
            return new File([content], fileName+'.json', { type: 'text/json' });
        }
        catch(e){
            throw CreateFileObjectError(e);
        }
        
    }

    
    /**
     * Uploads file(s) to Web3Storage and returns the CID for the root folder
     * @param  {Array<File>} files
     * @returns {Promise<String>} cid -- The Web3Storage CID to the root folder
     * @throws {UploadFileError}
     * @author @Chrimle
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
     * @param  {String} cid -- Only the random part of the full address
     * @param  {String} fileName -- The name and filetype of the file
     * @returns {Promise<string>} content 
     * @author @Chrimle
     * Inspiration: Kamil Kiełczewski https://stackoverflow.com/a/55784549/5424535
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
     * @returns {Promise<Array<File>>} results -- Array with all File objects in CID-directory
     * @author @Chrimle
     */
    async fetchEHRContents(cid){

        let results = [];

        let fileNames = await this.retrieveFileNames(cid);

        for (const fileName of fileNames) {

            let content = await FileService.fetchFileContent(cid, fileName);

            let file = new File([content], fileName, { type: 'text/json' });

            results.push(file);
        }

        return results;
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
        const res = await this.client.get(cid);
        const files = await res.files(); // Web3File[]
 
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
     */
     removeCidPrefix(path, cid) {
        path = path.replace(cid, "");
        return path;
    }

}
