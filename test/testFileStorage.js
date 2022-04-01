/**
 * Test for fileStorage class
 * @author Edenia Isaac
 * @author Hampus Jernkrook
 */

import FileStorage from "../server/fileStorage/fileStorage.js";
import CouldNotResolveCidError from "../server/fileStorage/couldNotResolveCidError.js";
import * as assert from "assert";
// import chai from "chai";
// const expect = chai.expect;
const fileStorage = new FileStorage();

// describe("check if we get the right url", function () {
//     it("returns the correct url for a valid cid", async function () {
        
//         const cid = "bafybeig2ni6bdohftpj62m4cqxf2tu2s5plza7enpi7ynyp3nqvmvd4n4u";
//         const urls = await fileStorage.retrieveFilesHelper(cid);
//         const expected = "https://bafybeig2ni6bdohftpj62m4cqxf2tu2s5plza7enpi7ynyp3nqvmvd4n4u.ipfs.dweb.link/tmp_test_upload/test1.txt"
//         assert.strictEqual(urls[0],expected);
//     });
//     /*
//     it('throws an error for wrong cid', async function() {
//         await expect(fileStorage.retrieveFilesHelper("_")).to.be.rejected.and.be.an.instanceOf(CouldNotResolveCidError);
//     });
//     */
// });

describe("check removing the cid ", function () {
    it("returns directoryname/filename from a valid path", function () {

        const cid = "bafybeig2ni6bdohftpj62m4cqxf2tu2s5plza7enpi7ynyp3nqvmvd4n4u";
        let path = "bafybeig2ni6bdohftpj62m4cqxf2tu2s5plza7enpi7ynyp3nqvmvd4n4u/tmp_test_upload/test1.txt"
        path = fileStorage.removeCidPrefix(path,cid);

        const actual = "/tmp_test_upload/test1.txt";

        assert.strictEqual(path, actual);
    });


});

describe("check getting the file name", function () {
    it("returns the correct file name ending a valid url", function () {
    
        const url = "https://bafkreigrexvw7ufm6qfzpstqfanekco3n3m2x4b4peenem6voyepqcff5m.ipfs.dweb.link/tmp_test_upload/test1.txt";
        const filename = fileStorage.getFileName(url);

        const actual = "test1.txt";

        assert.strictEqual(filename, actual);
   
    });

});

