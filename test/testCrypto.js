import crypto from "crypto";
import crypt from "../client/Crypto/crypt.js";
import * as assert from "assert";

describe("Test crypto", function () {
  it("Should return encrypted record_key", function () {
    var keyPair = {};
    var record_key;
    let plaintext = "Hej Wendy";

    crypto.generateKeyPair(
      "ec",
      {
        namedCurve: "secp256k1", // Options
        publicKeyEncoding: {
          type: "spki",
          format: "der",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "der",
        },
      },
      (err, publicKey, privateKey) => {
        // Callback function
        if (!err) {
          // Prints new asymmetric key
          // pair after encoding
          keyPair = {
            prKey: privateKey.toString("hex"),
            puKey: publicKey.toString("hex"),
          };

          //console.log("Public Key is: ", publicKey.toString("hex"));
          //console.log("Private Key is: ", privateKey.toString("hex"));
        } else {
          // Prints error
          console.log("Errr is: ", err);
        }
      }
    );

    crypto.generateKey("aes", { length: 128 }, (err, key) => {
      if (err) throw err;
      record_key = key.export().toString("hex");
    });

    var output = crypt.encryptRecordKey(keyPair.puKey, plaintext);
    console.log(output);
    
    //assert.equal(ehrEntry.date, date);
  });
});
