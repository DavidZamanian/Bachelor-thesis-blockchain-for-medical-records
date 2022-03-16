import { Web3Storage } from 'web3.storage'

import { getFilesFromPath } from 'web3.storage'

import { File } from 'web3.storage'

import * as http from "https";
import * as fs from "fs";

/**
 * Class for handling File Storage to Web3Storage as well as retrieving files 
 * Inspired by https://docs.web3.storage
 * @author Hampus Jernkrook
 * @author Edenia Isaac
 */
export default class FileStorage {
    constructor() {
        this.client = this.makeStorageClient();
    }

    /**
     * Sets API token from enviroment variable
     * @returns API token
     */
    getAccessToken() {
        /**  For this to work, you need to set the
         WEB3STORAGE_TOKEN environment variable before you run your code.
         */
        return process.env.WEB3STORAGE_TOKEN;
    }


    /**
     * Creates a Web3Storage client object by passing in an API token 
     * @returns Web3Storage client object
     */
    makeStorageClient() {
        return new Web3Storage({ token: this.getAccessToken() });
    }

    
    /**
     * Uploading files to Web3.Storage
     * @param {String} dir path to the directory containing the files to be stored 
     * @returns (cid) content identifier for the uploaded files
     */
    async storeFiles(dir) {
        const files = await this.getFiles(dir);
        const cid = await this.client.put(files);
        return cid;
    }

    /**
     * Helper method for preparing the files for upload
     * @param {String} path path to the directory containing the files to be stored
     * @returns Array of files to be used directly wiht the @function put client method
     */
    async getFiles(path) {
        const files = await getFilesFromPath(path);
        return files;
    }



    /**
     * Method to retrieve files from Web3.Storage
     * @param {String} cid content identifier for the file to be retrieved
     */
    async retrieveFiles(cid) {
        const urls = await this.retrieveFilesHelper(cid);
        await this.downloadAll(urls,cid);
    }

    /**
     * Method to get the files urls 
     * @param {Strinf} cid content identifier for the file to be retrieved
     * @returns Array of urls to the files to be retrieved 
     */
    async retrieveFilesHelper(cid) {
        const res = await this.client.get(cid)
        let urls = []
        for await (const entry of res.unixFsIterator()) {
            if (entry.type === "raw") {
                urls.push(`https://${cid}.ipfs.dweb.link${this.removeCidPrefix(entry.path, cid)}`);
            } 
        }
        return urls;
    }

    /**
     * Method to get urls in the right format 
     * @param {String} path - Path to file 
     * @param {String} cid - content indentifier to file
     * @returns url to the files to be retrieved 
     */
    removeCidPrefix(path, cid) {
        path = path.replace(cid, "");
        return path;
    }


    /**
     * Method to go through urls array and download the files into a temporary folder
     * @param {Array} urls Array of urls to the files to be retrieved 
     * @param {String} cid content indentifier to files
     */
    async downloadAll(urls,cid) {
        for (let i = 0; i < urls.length; i++) {
            await this.download(urls[i], `./tmp_test_download${this.getFileName(urls[i],cid)}`, (err, data) => {
                if (err) throw error;
            });
        }
    }
    
    /**
     * Method to get the name of the file from url
     * @param {String} url to the file to be retrieve
     * @param {String} cid content indentifier to file
     * @returns File name
     */
    getFileName(url,cid){
        url = url.replace(`https://${cid}.ipfs.dweb.link/tmp_test_upload`, "");
        return url;
    }

    /**
     * Help Method to download a file into a temporary folder
     * Inspiried by https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
     * @param {Strinf} url to the file to be retrieve
     * @param {String} dest path to where the file will be downloaded 
     * @param {Function} cb callback function
     */
    async download(url, dest, cb) {
        let file = fs.createWriteStream(dest);
        let request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);  
        });
        }).on('error', function(err) { 
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
    }
}

// TESTING
const fileStorage = new FileStorage();
console.log(fileStorage);
const cid = await fileStorage.storeFiles("./tmp_test_upload");
console.log(cid);
await fileStorage.retrieveFiles(cid);
console.log("COMPLETE")
//await retrieveFiles("bafybeiayhizcizphaxfhzmezvb3ncppjscqudglxzrq3wna2ew4o3iohty");
//let urls = await retrieveFiles2("bafybeiayhizcizphaxfhzmezvb3ncppjscqudglxzrq3wna2ew4o3iohty");
//console.log(urls);
//downloadAll(urls);
//await retrieveFiles2("bafkreigcpqi4tl43cxjxjvfuyslc4aisalywd3jubbhw5sx5hyeklyqnu4");