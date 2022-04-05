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
var record_key = crypto.KeyObject;
let privateKey;
let publicKey;

describe("Test crypto", function () {
  // Generate keys
  generateKeyFiles();

  //Test key derivation function
  it("Can derive privateKey from password", function () {
    //512-bit salt for 512 bit output bitLen
    var salt =
      "4E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A46";
    var password = "password123";
    var derivedKey;

    // check if a key can be derived from the password
    assert.doesNotThrow(() => {
      derivedKey = crypt.derivePrivateKeyFromPassword(password, salt);
    });
  });

  //Test key derivation function
  it("Can derive publicKey from privateKey", function () {
    //512-bit salt for 512 bit output bitLen
    var publicKey;

    //console.log("Public key: " + crypt.extractPublicKeyFromPrivateKey(privateKey));
    // check if a publicKey can be derived from a privateKey
    assert.doesNotThrow(() => {
      publicKey = crypt.extractPublicKeyFromPrivateKey(privateKey);
      console.log(publicKey);
    });
  });

  let record_key;

  it("Can encrypt/decrypt record key", function () {
    // generate symmetric AES key
    crypto.generateKey("aes", { length: 256 }, (err, key) => {
      if (err) throw err;

      record_key = key;
      var encrypted_record_key;
      var decrypted_record_key;

      // check if record key can be encrypted
      assert.doesNotThrow(() => {
        encrypted_record_key = crypt.encryptRecordKey(key.export(), publicKey);
      });

      // check if record key can be decrypted
      assert.doesNotThrow(() => {
        decrypted_record_key = crypt.decryptRecordKey(
          encrypted_record_key,
          privateKey
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
      publicKey
    );

    // check if EHR can be encrypted
    assert.doesNotThrow(() => {
      encryptedEHR = crypt.encryptEHR(encrypted_record_key, ehrBuf, privateKey);
    });

    // check if EHR can be decrypted
    assert.doesNotThrow(() => {
      decryptedEHR = crypt.decryptEHR(
        encrypted_record_key,
        encryptedEHR,
        privateKey
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
  //fs.writeFileSync("public_key", keyPair.publicKey);
  //fs.writeFileSync("private_key", keyPair.privateKey);
  //privateKey = keyPair.privateKey;
  //publicKey = keyPair.publicKey;

  privateKey = `-----BEGIN PRIVATE KEY-----
MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBANSIBpLQNO+J+VGL
TO6bhB+lO6lOoRwCe6NPcjqv1r0z6Eu3eEFfvkgGpCxxwZjpj8Vb/OfCgJkABNn4
ecBS4j0iYhIz0BS4624Z+G/6kFcy/MqUeUOPSUeJMOWdCH8usjXqkTuB9bT0WOiN
mPNm2x5oOPUceK/MP4QW/YtzJa1TAgMBAAECgYAtvPhtMBG0W2Ukf24XC7DrfovQ
a/OQK5igFMDokF8OaNVdNibTKt+wcH10cybO2bTvLFTJK7qxMqfYoPjSwwOc8Bpb
YzRsXgpanydspsUOvoCNXtHmEybSmZ1meP1URB2WD/Lt1fHl5x4PXfbetoqK+Da4
m1GNnMbDI9gIwUdtQQJBAOuA3V+1LfYNOPPRQI9vQmzSZapty+KsCQADqZEl3JR7
7xDUzucLv0owfJMaotISN65c+mTdkM3sdbeY47kO4PUCQQDnB1Ub1z4hkPIJOEAm
ak+EsKPyC2DuKK8QOB+ddX1CCaienmgWfWuN6nImO5Rwmv0JsUYK6mMgOTX3gzXc
WsgnAkB+yKdlKRMPTdsFV/fbwFgQYcydzfJfm6JUwaP+IlX4EiiH9SlWNXrMJAJM
56AUW/5h/mhG+QlF8zEEoGiobhwpAkBFDe8FjFe45r9BvDuIf/xWuAm4/mexqB1z
pqLkiMqw43wwNT79ge2VFL+b5/Edm2YI8KD0AE0yw4b6/ZAq1kO/AkAWUBHUxI1K
bIq/ZkmEM0nbWOu8uU60hoos0oHKjuBF9KFN8p3dlodz0N02UAqLjjx1COiC341F
HTPhtf3w2f2F
-----END PRIVATE KEY-----
`;

  publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUiAaS0DTviflRi0zum4QfpTup
TqEcAnujT3I6r9a9M+hLt3hBX75IBqQsccGY6Y/FW/znwoCZAATZ+HnAUuI9ImIS
M9AUuOtuGfhv+pBXMvzKlHlDj0lHiTDlnQh/LrI16pE7gfW09FjojZjzZtseaDj1
HHivzD+EFv2LcyWtUwIDAQAB
-----END PUBLIC KEY-----
`;

  console.log(publicKey)
  console.log(privateKey)
}
