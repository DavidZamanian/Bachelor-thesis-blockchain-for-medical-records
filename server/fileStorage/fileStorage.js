import { Web3Storage } from 'web3.storage'

import { getFilesFromPath } from 'web3.storage'

import * as http from "https";
import * as fs from "fs";
import CouldNotResolveCidError from './couldNotResolveCidError.js';
import DownloadError from './downloadError.js';

/**
 * Class for storing and retrieving files from the distributed file storage. 
 * Currently connects to Web3Storage.
 * Methods are for the most part copied/inspired by pages found at https://docs.web3.storage.
 * @author Hampus Jernkrook
 * @author Edenia Isaac
 */
export default class FileStorage {
    /**
     * Initialises a FileStorage object and sets the storage client to connect to. 
     */
    constructor() {
        this.client = this.makeStorageClient();
    }

    /**
     * Gets the web3.storage API token from the WEB3STORAGE_TOKEN enviroment variable.
     * Copied from https://docs.web3.storage/how-tos/store/. 
     * 
     * @returns API token
     */
    getAccessToken() {
        /**  For this to work, you need to set the
         WEB3STORAGE_TOKEN environment variable before you run your code.
         */
        return process.env.WEB3STORAGE_TOKEN;
    }


    /**
     * Creates a Web3Storage client object by passing in an API token.
     * Copied from https://docs.web3.storage/how-tos/store/. 
     * @returns Web3Storage client object
     */
    makeStorageClient() {
        return new Web3Storage({ token: this.getAccessToken() });
    }

    
    /**
     * Uploads files to Web3.Storage. 
     * Copied and slighlty modified from https://docs.web3.storage/how-tos/store/. 
     * 
     * @param {String} dir path to the directory containing the files to be stored 
     * @returns {String} (cid) content identifier for the uploaded files
     */
    async storeFiles(dir) {
        const files = await this.getFiles(dir);
        const cid = await this.client.put(files);
        return cid;
    }

    /**
     * Fetches the files in the specified path (directory) to an array of Files.
     * Copied and slighlty modified from https://docs.web3.storage/how-tos/store/.  
     * 
     * @param {String} path path to the directory containing the files to be stored
     * @returns Array of files to be used directly with the @function put client method
     */
    async getFiles(path) {
        const files = await getFilesFromPath(path);
        return files;
    }



    /**
     * Method to retrieve files from Web3.Storage and download into the given directory. 
     * @param {String} cid content identifier at IPFS/web3.storage for the content archive to be retrieved.
     * @param {String} dir directory to download the files into. 
     */
    async retrieveFiles(cid, dir) {
        const urls = await this.retrieveFilesHelper(cid);
        await this.downloadAll(urls, dir);
    }

    /**
     * Method to get the files' urls, where they can be accesses via an ipfs web interface. 
     * Inspired by https://docs.web3.storage/how-tos/retrieve/#using-the-client-libraries 
     * and https://docs.web3.storage/reference/js-client-library/#retrieve-files. 
     * 
     * @param {String} cid content identifier for the file to be retrieved
     * @returns Array of urls of the files to be retrieved 
     */
    async retrieveFilesHelper(cid) { 
        const res = await this.client.get(cid)
        if (!res.ok) { // handling erronous cid.
            throw new CouldNotResolveCidError(`${res.status} ${res.statusText}`);
        }
        let urls = []
        for await (const entry of res.unixFsIterator()) {
            if (entry.type === "raw") {
                urls.push(`https://${cid}.ipfs.dweb.link${this.removeCidPrefix(entry.path, cid)}`);
            } 
        }
        return urls;
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


    /**
     * Method to go through urls and download the files into the specified directory.
     * @param {Array} urls Array of urls to the files to be retrieved 
     * @param {String} dir the directory to download the files into. 
     */
    async downloadAll(urls, dir) {
        for (let i = 0; i < urls.length; i++) {
            await this.download(urls[i], `${dir}/${this.getFileName(urls[i])}`, (err) => {
                if (err) throw new DownloadError(err.message);
            });
        }
    }

    getFileName(url) {
        const urlParts = url.split("/");
        return urlParts[urlParts.length - 1]; // the last url part is the filename
    }

    /**
     * Method to download a single file into the specified location. 
     * NOTE: this method is directly copied from Vince Yuan's post in the stackoverflow thread:
     * https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries.
     * Copied 2022-03-11.
     * Only changes made by us are some changes to comments and using `let` instead of `var`, as well as handling errors on `file`.
     * @param {String} url to the file to be retrieve
     * @param {String} dest path to where the file will be downloaded, including both directory and file name. 
     * @param {Function} cb callback function taking an error as parameter.
     */
    async download(url, dest, cb) {
        let file = fs.createWriteStream(dest);
        file.on("error", (err) => cb(err));
        let request = http.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(cb);  
            });
            file.on("error", (err) => cb(err));
        }).on('error', function(err) { 
            fs.unlink(dest); //delete the file if an error occurred. 
            if (cb) cb(err);
        });
    }

    
}


// SCRIPT FOR TESTING - FOR DEVELOPMENT PURPOSES 
// UNCOMMENT AND RUN TO CHECK THAT EVERYTHING WORKS
/*
//setup
const fileStorage = new FileStorage();
const cid = "bafybeig2ni6bdohftpj62m4cqxf2tu2s5plza7enpi7ynyp3nqvmvd4n4u";
const downloads_directory = "./tmp_test_download";
const uploads_directory = "./tmp_test_upload";
*/

//uploading to web3.storage
//fileStorage.storeFiles(uploads_directory);

// checking the urls
/*
const urls = await fileStorage.retrieveFilesHelper(cid);
console.log(urls);
*/
// downloading into ./tmp_test_download
//fileStorage.retrieveFiles(cid, "./tmp_test_download");


//checking errors
//===================
// incorrect cid
// Error: Response was not ok: 500 Internal Server Error - Check for { "ok": false } on the Response object before calling .unixFsIterator
// fileStorage.retrieveFiles("_", downloads_directory);
//===================
// incorrect downloads folder
// Error: ENOENT: no such file or directory, open '_/test1.txt'
// fileStorage.retrieveFiles(cid, "_");
//===================
