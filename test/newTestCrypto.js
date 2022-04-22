import * as assert from "assert";
import crypto from "crypto";
import * as path from "path";
import crypt from "../client/Crypto/crypt.js";
import JSONService from "../server/jsonHandling/jsonService.js";
import * as fc from "fast-check";

/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author Christopher Molin
 */

const example_directory = "./test/json_examples";

const examplePublicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUiAaS0DTviflRi0zum4QfpTup
TqEcAnujT3I6r9a9M+hLt3hBX75IBqQsccGY6Y/FW/znwoCZAATZ+HnAUuI9ImIS
M9AUuOtuGfhv+pBXMvzKlHlDj0lHiTDlnQh/LrI16pE7gfW09FjojZjzZtseaDj1
HHivzD+EFv2LcyWtUwIDAQAB
-----END PUBLIC KEY-----
`;

const examplePrivateKey = `-----BEGIN PRIVATE KEY-----
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

const exampleRecordKey =
  "LhUjB3jms1JNWgHfmsNZcjrAgQWdRzITn49lZs+CHfSkWTWkqNNKY9/Qn/GdJh1jE1fmSOfnuRgE2BuwUl3TG25TDYIGqmFVG3ydSOyi5i5PqE5xWJSOTvn4g6zp/syPzzA8pr8zD//f8d2+C97Nvpypfh8DaUhG2HY2FyaHyIE=";

describe("Test keys", async () => {
  const salt =
    "4E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A46";
  const password = "password123";
  let derivedPrivateKey = "";
  let derivedPublicKey = "";
  let derivedExamplePublicKey = "";

  it("Derive PrivateKey from Password & Salt", async () => {
    assert.doesNotThrow(async () => {
      derivedPrivateKey = await crypt.derivePrivateKeyFromPassword(
        password,
        salt
      );
      //console.log(derivedPrivateKey);
    });
  }).timeout(10000);

  it("Derived PrivateKey is of correct length", async () => {
    assert.equal(derivedPrivateKey.length, examplePrivateKey.length);
  });

  it("Derive PublicKey from Example PrivateKey", async () => {
    assert.doesNotThrow(async () => {
      derivedExamplePublicKey =
        crypt.extractPublicKeyFromPrivateKey(examplePrivateKey);
    });
    console.log("This privateKey works: " + examplePrivateKey);
  });

  it("Derive PublicKey from Derived PrivateKey", async () => {
    assert.doesNotThrow(async () => {
      derivedPrivateKey = await crypt.derivePrivateKeyFromPassword(
        password,
        salt
      );
      derivedPublicKey = await crypt.extractPublicKeyFromPrivateKey(
        derivedPrivateKey
      );
    });
  });

  /**
   * Here the problem begins. The derived publicKey is not the correct length, compared
   * to a key we know works fine
   *
   *
   */

  it("Derived PublicKey is of correct length", async () => {
    derivedPrivateKey = await crypt.derivePrivateKeyFromPassword(
      password,
      salt
    );
    console.log("Derived private key:" + derivedPrivateKey);
    derivedPublicKey = await crypt.extractPublicKeyFromPrivateKey(
      derivedPrivateKey
    );
    //console.log("Derived length: " + derivedPublicKey.length);
    //console.log("Example length: " + derivedExamplePublicKey.length);
    assert.equal(derivedPublicKey.length, derivedExamplePublicKey.length);
  });

  let newRecordKey = "";
  let encryptedRecordKey = "";
  let encryptedExampleRecordKey = "";
  let decryptedRecordKey = "";
  let decryptedExampleRecordKey = "";

  it("Generate Record key", async () => {
    assert.doesNotThrow(async () => {
      crypto.generateKey("aes", { length: 256 }, (err, key) => {
        if (err) throw err;

        newRecordKey = key.export().toString("base64");
      });
    });
  });

  it("New Encrypted Record Key is of correct length", async () => {
    encryptedRecordKey = crypt.encryptRecordKey(newRecordKey, examplePublicKey);
    assert.equal(encryptedRecordKey.length, exampleRecordKey.length);
  });

  it("Encrypt Example Record Key with Example Public Key", () => {
    assert.doesNotThrow(async () => {
      encryptedExampleRecordKey = crypt.encryptRecordKey(
        exampleRecordKey,
        examplePublicKey
      );
    });
  });

  it("Encrypt New Record Key with Derived Public Key", () => {
    assert.doesNotThrow(async () => {
      encryptedRecordKey = crypt.encryptRecordKey(
        newRecordKey,
        derivedPublicKey
      );
    });
  });

  it("Decrypt Example Record Key with Example Private Key", () => {
    assert.doesNotThrow(async () => {
      decryptedExampleRecordKey = crypt.decryptRecordKey(
        encryptedExampleRecordKey,
        examplePrivateKey
      );
    });
  });

  it("Decrypt Record Key with Private Key", () => {
    assert.doesNotThrow(async () => {
      decryptedRecordKey = crypt.decryptRecordKey(
        encryptedRecordKey,
        derivedPrivateKey
      );
    });
  });

  it("Decrypted Example Record key is equal to Original Example Record Key", async () => {
    encryptedExampleRecordKey = await crypt.encryptRecordKey(
      newRecordKey,
      examplePublicKey
    );
    decryptedExampleRecordKey = await crypt.decryptRecordKey(
      encryptedExampleRecordKey,
      examplePrivateKey
    );
    assert.equal(decryptedExampleRecordKey, newRecordKey);
  });

  it("Decrypted Record key is equal to Original Record Key", async () => {
    crypto.generateKey("aes", { length: 256 }, async (err, key) => {
      if (err) throw err;

      newRecordKey = key.export().toString("base64");
      encryptedRecordKey = await crypt.encryptRecordKey(
        newRecordKey,
        derivedPublicKey
      );

      decryptedRecordKey = await crypt.decryptRecordKey(
        encryptedRecordKey,
        derivedPrivateKey
      );

      assert.equal(decryptedRecordKey, newRecordKey);
    });
  });
});

describe("Test encryption of file content", () => {
  let newRecordKey = "";
  crypto.generateKey("aes", { length: 256 }, (err, key) => {
    if (err) throw err;

    newRecordKey = key.export().toString("base64");
  });

  it("Encrypting and decrypting EHR with example keys", async () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (originalData) => {
        let stringifiedData = JSON.stringify(originalData);
        let encryptedData = crypt.encryptEHR(
          exampleRecordKey,
          stringifiedData,
          examplePrivateKey
        );
        let decryptedData = crypt.decryptEHR(
          exampleRecordKey,
          encryptedData,
          examplePrivateKey
        );

        assert.equal(stringifiedData, decryptedData);
      })
    );
  });
  it("Encrypting and decrypting EHR with real keys", async () => {
    const salt =
      "4E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A46";
    const password = "password123";
    let derivedPrivateKey = await crypt.derivePrivateKeyFromPassword(
      password,
      salt
    );
    let derivedPublicKey = await crypt.extractPublicKeyFromPrivateKey(
      derivedPrivateKey
    );

    fc.assert(
      fc.property(fc.string({ minLength: 1 }), async (originalData) => {
        let derivedPrivateKey = await crypt.derivePrivateKeyFromPassword(
          password,
          salt
        );
        let derivedPublicKey = await crypt.extractPublicKeyFromPrivateKey(
          derivedPrivateKey
        );

        let encryptedRecordKey = await crypt.encryptRecordKey(
          newRecordKey,
          derivedPublicKey
        );

        let stringifiedData = JSON.stringify(originalData); //JSON.stringify("Hej") //
        //console.log(stringifiedData);
        // encryptEHR decrypts the encryptedRecordKey, this throws an error.
        let encryptedData = await crypt.encryptEHR(
          encryptedRecordKey,
          stringifiedData,
          derivedPrivateKey
        );
        console.log("Encrypt Success" + encryptedData.encryptedData);
        let decryptedData = await crypt.decryptEHR(
          encryptedRecordKey,
          encryptedData,
          derivedPrivateKey
        );
        console.log("Decrypt Success: " + decryptedData);
        console.log(stringifiedData == decryptedData);

        assert.equal(stringifiedData, decryptedData);
      })
    );
  }).timeout(10000);
});
