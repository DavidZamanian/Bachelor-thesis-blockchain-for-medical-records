import { Web3Storage } from 'web3.storage'

import { getFilesFromPath } from 'web3.storage'

import { File } from 'web3.storage'

import * as http from "https";
import * as fs from "fs";

export default class FileStorage {
    constructor() {
        this.client = this.makeStorageClient();
    }

    makeStorageClient() {
        return new Web3Storage({ token: this.getAccessToken() });
    }

    getAccessToken() {
        // For this to work, you need to set the
        // WEB3STORAGE_TOKEN environment variable before you run your code.
        return process.env.WEB3STORAGE_TOKEN;
    }
      
    
    async storeFiles(dir) {
        const files = await this.getFiles(dir);
        const cid = await this.client.put(files);
        return cid;
    }

    async getFiles(path) {
        const files = await getFilesFromPath(path);
        return files;
    }

    async retrieveFiles(cid) {
        const urls = await this.retrieveFilesHelper(cid);
        console.log(`ALL URLS: ${urls}`);
        await this.downloadAll(urls);
    }

    // slightly modified
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

    removeCidPrefix(path, cid) {
        path = path.replace(cid, "");
        return path;
    }

    async downloadAll(urls) {
        for (let i = 0; i < urls.length; i++) {
            console.log(`URL IS: ${urls[i]}`);
            await this.download(urls[i], `./tmp_test_download/file${i}.txt`, (err, data) => {
                if (err) {console.log("TODO CHANGE THIS!!!")} 
            });
        }
    }

    // taken from https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
    // from comment by <author>, 2022-03-11. 
    async download(url, dest, cb) {
        let file = fs.createWriteStream(dest);
        let request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);  // close() is async, call cb after close completes.
        });
        }).on('error', function(err) { // Handle errors
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