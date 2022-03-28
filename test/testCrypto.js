import crypto from "crypto";
import crypt from "../client/Crypto/crypt.js";
import * as assert from "assert";
import fs from "fs";

describe("Test crypto", function () {
  it("Should return encrypted record_key", function () {
    var record_key;
    let plaintext = "Hej Wendy";

    function generateKeyFiles() {
      const keyPair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 1024,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      // Creating public and private key file
      fs.writeFileSync("public_key", keyPair.publicKey);
      fs.writeFileSync("private_key", keyPair.privateKey);
    }

    // Generate keys
    generateKeyFiles();

    var encrypted = crypt.encryptRecordKey(plaintext, "./public_key");
    var decrypted = crypt.decryptRecordKey(encrypted, "private_key");
    console.log("Encrypted: " + encrypted + "Decrypted: " + decrypted);

    assert.equal(plaintext, decrypted);
    assert.doesNotThrow(() => {
      crypt.encryptRecordKey(plaintext, "./public_key");
    });
    assert.doesNotThrow(() => {
      crypt.decryptRecordKeyTEST(encrypted, "private_key");
    });

    crypto.generateKey("aes", { length: 128 }, (err, key) => {
      if (err) throw err;
      record_key = key.export().toString("hex");
    });
  });
});
