import * as assert from "assert";
import crypto from "crypto";
import fs from "fs";
import * as path from "path";
import crypt from "../client/Crypto/crypt.js";
import JSONService from "../server/jsonHandling/jsonService.js";


/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author David Zamanian, Nils Johnsson, Wendy Pau
 */

const example_directory = "./test/json_examples";

describe("Test crypto", function () {
  // Generate keys
  generateKeyFiles();

  let record_key;

  it("Should be able to encrypt/decrypt record key", function () {
    // generate symmetric AES key
    crypto.generateKey("aes", { length: 128 }, (err, key) => {
      if (err) throw err;

      record_key = key;
      var encrypted_record_key;
      var decrypted_record_key;

      // check if record key can be encrypted
      assert.doesNotThrow(() => {
        encrypted_record_key = crypt.encryptRecordKey(
          key.export(),
          "./public_key"
        );
      });

      // check if record key can be decrypted
      assert.doesNotThrow(() => {
        decrypted_record_key = crypt.decryptRecordKey(
          encrypted_record_key,
          "./private_key"
        );
      });

      // check that record key has not changed through cryptation
      assert.equal(key.export().toString("base64"), decrypted_record_key);
    });
  });

  it("Can encrypt/decrypt EHR", () => {
    // get an EHR in json
    const ehrJSON = JSONService.fromJsonFile(
      path.join(example_directory, "EHR_entry.json")
    );

    // convert to string
    const ehrBuf = Buffer.from(JSON.stringify(ehrJSON));

    var encryptedEHR;
    var decryptedEHR;

    // encrypt the record key
    var encrypted_record_key = crypt.encryptRecordKey(
      record_key.export(),
      "./public_key"
    );

    // check if EHR can be encrypted
    assert.doesNotThrow(() => {
      encryptedEHR = crypt.encryptEHR(
        encrypted_record_key,
        ehrBuf,
        "./private_key"
      );
    });

    // check if EHR can be decrypted
    assert.doesNotThrow(() => {
      decryptedEHR = crypt.decryptEHR(
        encrypted_record_key,
        encryptedEHR,
        "./private_key"
      );
    });

    // check that EHR has not changed through cryptation
    assert.equal(ehrBuf, decryptedEHR);
  });
});

function generateKeyFiles() {
  // Generate keypair
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