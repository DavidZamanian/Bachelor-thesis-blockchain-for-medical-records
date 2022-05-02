import * as assert from "assert";
import crypto from "crypto";
import * as path from "path";
import crypt from "../client/Crypto/crypt.js";
import JSONService from "../server/jsonHandling/jsonService.js";
import * as fc from "fast-check";

/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author Christopher Molin, David Zamanian, Nils Johnsson, Wendy Pau
 */

//DO NOT CHANGE THESE
const universalPassword = "123456";

const ericAnderssonPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDeF5RYP46NCpNj
cRO73CgN0zyUGfq2cZSqAXqPJDvF5tE7+Rx5IUEibcNgjaoMMteRnBmb/Ol8m7ox
auVMaBmHlRh1hM6PYZPcplLfwPNrzN83OYTv5l42BK+NSnIa7scpJeLAhjX/2qDI
vqGsEtR8PKho9nlB03Vpm/Gga98tz3MJWLJHX5Vw3k0n/9aD+vLrZ+qZX9zRx617
feI6hScKwSMrf7FjrJkj9ElX0tRl1V5bjKdNL/bQO1esbze5xcuRAS3dH0cvOFc/
+PeC7dk+l6x965v9o0EvLyboQ7gnerWYpnByyqN9S7xkU/HMP93/gSwbsA3Zhjdy
tWtPnOjJAgMBAAECggEAX8SDL1qYubDpxWOpQsS4cN25rZNWTP3FQVnJ45eYPso9
R0MwR/tS/umd6jCsNv5lfmB1mpIAjL8KFu0lW0E4YQKlvWc7OxC0ld0St3GYhc+e
IU4oSNppnZl/qcmEUqDMOK4hjStSdbVsx6OMS4sDHV96r2g4+W2Zn6SjGK3rWvDf
yFy90rUA27/GETDGHFtMv79wPSZqjzPS8qI3REEa3KWQJlBuuT33ev5NC16CWyvD
zHilYu4QBTHuaVhr3LnYbAt1sPeNYJGMFE7P50FmABvWfYzpntEVv8N2PopBITUd
2QCGkXeykt3iWhVFjPUNtIaQApfZR1Uh/rcEszy9QQKBgQD2BF6PoRqUjQrtEbUC
8f88dSoCfDoAIqFTiyF52qebwEvdjufH+gEeLSTnK8XDiaI84SlsgnxHEjdr9vvL
UcUj54Kq01IH6heghVpg10VzAyMb28dOz+lUPcD8zS3791tnyU+5fmjTsgVfr+37
yuKS7o76Rg4A8cPTU7ztlRhfhQKBgQDnGq1Va29B435slFP2x8eGPeUPBl5IUtZ4
UVn2dzKF6YaVw7jNwBV/Tbi8fZ62+3OHlgfmlemdFoUHizYjotUpnqk3l94ly7bU
UO6hMjkAb0EyTRqP0TGkB9lLBnZy/4wNujE3IsdOMdDODEV/bKHvMj5bDzYuGpyD
dzGRBXmNdQKBgQDUJlJxI2lrfvFUHHfu8Ua8GQFAIWZW5YYfKBSXIyJ0YnBJwElK
HuJF5oIzQ4EILTEVtMlnBGMtWp0mYlciLwKFAsigjRjpMEptp3GXnywJkUP+axlF
cm9wsMwydLFZ3iYZqvUwLb0yCQsvR+Q+xOd783KiijTbRaEsJMMAUhkxjQKBgGcW
nU9HNz/a7OAeYj3o6/XT0kObgZ8dZJITJ+ArV5woiWJxBhSxpGU/FDLwjkXtcKGA
qVGQeb8a9ohg7uuCjTedkLo9wlh1wL6Aw5GgR5EMD7cScdDJbi1PWvx+i4PMvnq5
HY8Msn8M9amUC8RFfw6mCO6xoGd8c2ipWLDqEkipAoGABcHmNzYN+KJrRdGO3EjP
V0+Tqn6hOpRhC7QuGWp9LYbJZq9Jxd8iTVaA7OsrMGI5l6wJ6iy+jA2/PGdEPBW2
9dyFsWGPYgmtu59zFvtdttx42EF90JJIlrLxYAJLmCAMs9lKiEOvN/LfZpm3FefM
iHGrdRm59zz65QPvDx5q8So=
-----END PRIVATE KEY-----
`;

const ericAnderssonPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3heUWD+OjQqTY3ETu9wo
DdM8lBn6tnGUqgF6jyQ7xebRO/kceSFBIm3DYI2qDDLXkZwZm/zpfJu6MWrlTGgZ
h5UYdYTOj2GT3KZS38Dza8zfNzmE7+ZeNgSvjUpyGu7HKSXiwIY1/9qgyL6hrBLU
fDyoaPZ5QdN1aZvxoGvfLc9zCViyR1+VcN5NJ//Wg/ry62fqmV/c0cete33iOoUn
CsEjK3+xY6yZI/RJV9LUZdVeW4ynTS/20DtXrG83ucXLkQEt3R9HLzhXP/j3gu3Z
Ppesfeub/aNBLy8m6EO4J3q1mKZwcsqjfUu8ZFPxzD/d/4EsG7AN2YY3crVrT5zo
yQIDAQAB
-----END PUBLIC KEY-----
`;

const ericSalt =
  "3LZD1EHZUO3LZK65FKJDD1FQ44THRBE8K7ZTR2Y3RVJSMDQNW67K3Y75QUAEWWXY88CP8Z43SVJ6E3LKUR45Z3WOKY86RWIVIK31PY7R6J7IKCV5VDYB1FG4UN3ST8M3";

const ericRecordKey = `KuM4sQeaBMXUN4Gpo1qRj1tUhyaAtDqpxXVyoMvgb9w=`;
const SlickRickRecordKey = `2BSPncgSPTVKNJ4/zvxCeX33M7oSUl6fOgjhTT6AxpQ=`;

const slickRickPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkoNh7Iw/XnGnH
bQh1MtqDWL+h4gWfgwGvy9VZd5rTW68oBkuupR7YCMgYGhJA1GCkSJPYP5mxjOyu
559mJDgCeYNWzkacZ/haBldYAU1XikRy3Ui0D3mJZ0Q76bWMZvmPClccMJMmYVyF
j7Qb9rSSf5M/ERi5s/wedJ9pdC1QwYvDdBzNg2sbNIYYlcEQbUFdSAjV/5hV/leL
aZpvgnkftP5qRyFZW83/P3HERjPaeCRefBUveBxmljcFSxC+Cwx72fthDblPpC5r
bXVQmnkiUmnoW4yk9gIEZWOjwE2XZRkyDnggivutGUhSZxmLLhM2jq8GwKLWjg0O
SDUg3x45AgMBAAECggEASzhIQSsl+TAy9TQARl722aQHWIF+jB6UHXyYsxjQzZ0q
oaaAm/MjlLw+6P8a5k15hlOCoPE75diRvnHiVb6w1s+X0KWJQchLQ4M2lXPIOHb7
UjdPxj4ZJIXfQz7/RjRTAybJxjKNF2GNCTxga5rdih2DGorLcb2vw21nTVC14A1O
dMLILtMDNwau68O9pnJbNVhc1tt0V6hoayCLXIZom9XAJfXLKsVreKn5ZDLu05a7
zhPu9VM5Eh4bgFaifUv6dwNjMaWKwm9XWcnuUwiC/wu6dQ8iq22rLasrpW4srCgJ
CNn4pbsJUhxaZJxMIudxHgGWxqi2Y2ydIvCwA+o8oQKBgQD0hJ2oYKkvJpXu2Hoz
FSqyxOxE2V/wpZ0mHTeyTiae1AmAytb7Tpe4ayd3KtSZNxybNcXIjvqTqrE06sRD
Go/IQ830nOOLkMCZ+Ip7tNOVvfH21kOQLa7IQrybcwpWgk6mLxB0+y9IFja9JJo0
8yBp+m7EDHFLH8O8lJ4LzwFuxQKBgQDvXTecLggQAJCO0MHZ5L/LdVbG3ojebs86
jeI8IQ2G08xm8wXZt6ZaIXUDVe54J0rrz9X8u3B4Kt3vxE4c7PHIchs+rLILpb3H
lUdSc9/kUsvnV8qga/irGf0D7UCE0LE7XZG9JdY9TK8nCGSeIHnkiKv1nOCnC8mG
K0hv+qto5QKBgQDAoJzHIecGcyJYuAeEqJ8rmED9eDXBkea8OPZArJp2M1qNML6t
2dtieF/t3DsBvM33ZCQ8/I5guG7D3lLg/lLZFLlyhAoqT827PnZyQCETbUDqER/G
vIZd011cJQO25Q7qklcnoR49buqOlQA6yHH3q0eJgLfb09lSfc4IRXq+dQKBgQCV
SjOD8mXO7Ts8B9HP/87rq9yannMJIF2ZbKLc09Sm8fR7hTlx6AwWDOX5VaAtSnx9
BRy2y4VDPaE8iNgbTGEknp6FgZpuj0oFcAKS13id5FIOkP/s/EqVFNlsmI30CGFx
4FMkgLPVeb2If8CZqzG7Ks7tmpG3Pi/LwbUlOlesTQKBgDhy7V32jAw9IF5SrdQd
+Ln3QD70PdXTY/SDKK6KrD8X+kJUJ5Oi1yFMWNYi9lkzvRe7dhEn6S08AljnR+h8
YNwQUATLoE45cwvSArDZPmK0SYl/cJXwE4urMK4jWCXRBtLdmXhJdQwQJIPgR273
5aBWJ9Uuhdwru0lj7f9AFQVW
-----END PRIVATE KEY-----`;

const slickRickPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5KDYeyMP15xpx20IdTLa
g1i/oeIFn4MBr8vVWXea01uvKAZLrqUe2AjIGBoSQNRgpEiT2D+ZsYzsruefZiQ4
AnmDVs5GnGf4WgZXWAFNV4pEct1ItA95iWdEO+m1jGb5jwpXHDCTJmFchY+0G/a0
kn+TPxEYubP8HnSfaXQtUMGLw3QczYNrGzSGGJXBEG1BXUgI1f+YVf5Xi2mab4J5
H7T+akchWVvN/z9xxEYz2ngkXnwVL3gcZpY3BUsQvgsMe9n7YQ25T6Qua211UJp5
IlJp6FuMpPYCBGVjo8BNl2UZMg54IIr7rRlIUmcZiy4TNo6vBsCi1o4NDkg1IN8e
OQIDAQAB
-----END PUBLIC KEY-----
`;

const rickSalt =
  "SHYF0O0I96ZDTQHLLKZB4CN92791JWKZOMKQBB8N3K5QIGLMP1LX6PBKW5893WADCHK9NPBCPEJPA1ZS7YN3NDWBW0TIA3I70UVJE0H37YWWHERBQYEFAE2SVULPBM75";

const exampleRecordKey =
  "LhUjB3jms1JNWgHfmsNZcjrAgQWdRzITn49lZs+CHfSkWTWkqNNKY9/Qn/GdJh1jE1fmSOfnuRgE2BuwUl3TG25TDYIGqmFVG3ydSOyi5i5PqE5xWJSOTvn4g6zp/syPzzA8pr8zD//f8d2+C97Nvpypfh8DaUhG2HY2FyaHyIE=LhUjB3jms1JNWgHfmsNZcjrAgQWdRzITn49lZs+CHfSkWTWkqNNKY9/Qn/GdJh1jE1fmSOfnuRgE2BuwUl3TG25TDYIGqmFVG3ydSOyi5i5PqE5xWJSOTvn4g6zp/syPzzA8pr8zD//f8d2+C97Nvpypfh8DaUhG2HY2FyaHyIE=";

const keyPair = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});
let derivedPrivateKey = keyPair.privateKey;
let derivedPublicKey = keyPair.publicKey;
let newRecordKey = "";
const salt =
  "4E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A46";

describe("Testing encryption/decryption of private, public and recordKey", async () => {
  let encryptedRecordKey = "";
  let encryptedExampleRecordKey = "";
  let decryptedRecordKey = "";
  let decryptedExampleRecordKey = "";

  it("Generate Record key", async () => {
    assert.doesNotThrow(async () => {
      crypto.generateKey("aes", { length: 256 }, (err, key) => {
        if (err) throw err;

        newRecordKey = key.export().toString("base64");
        //console.log("Record key: " + newRecordKey)

        //await AddKeysToNewPatient("3VBIIE4oJnabVVXJd2s3F02WarF3");

        //--------For testing-------
        let EricencryptedRecordKey = crypt.encryptRecordKey(
          ericRecordKey,
          ericAnderssonPublicKey
        );
        let RickencryptedRecordKey = crypt.encryptRecordKey(
          ericRecordKey,
          slickRickPublicKey
        );
        //console.log("Erics record_key: " + EencryptedRecordKey)
        //console.log("Ricks record_key: " + RencryptedRecordKey)
      });
    });
  });

  it("New Encrypted Record Key is of correct length", async () => {
    encryptedRecordKey = await crypt.encryptRecordKey(
      newRecordKey,
      derivedPublicKey
    );
    assert.equal(encryptedRecordKey.length, exampleRecordKey.length);
  });

  it("Encrypt Example Record Key with Example Public Key", () => {
    assert.doesNotThrow(async () => {
      encryptedExampleRecordKey = await crypt.encryptRecordKey(
        exampleRecordKey,
        examplePublicKey
      );
    });
  });

  it("Encrypt New Record Key with Derived Public Key", () => {
    assert.doesNotThrow(async () => {
      encryptedRecordKey = await crypt.encryptRecordKey(
        newRecordKey,
        derivedPublicKey
      );
    });
  });

  it("Decrypt Example Record Key with Example Private Key", () => {
    assert.doesNotThrow(async () => {
      decryptedExampleRecordKey = await crypt.decryptRecordKey(
        encryptedExampleRecordKey,
        examplePrivateKey
      );
    });
  });

  it("Decrypt Record Key with Private Key", () => {
    assert.doesNotThrow(async () => {
      decryptedRecordKey = await crypt.decryptRecordKey(
        encryptedRecordKey,
        derivedPrivateKey
      );
    });
  });

  it("Decrypted Example Record key is equal to Original Example Record Key", async () => {
    encryptedExampleRecordKey = await crypt.encryptRecordKey(
      newRecordKey,
      ericAnderssonPublicKey
    );
    decryptedRecordKey = await crypt.decryptRecordKey(
      encryptedExampleRecordKey,
      ericAnderssonPrivateKey
    );
    assert.equal(decryptedRecordKey, newRecordKey);
  });

  it("Decrypted Record key is equal to Original Record Key", async () => {
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

  it("Encrypt and decrypt privateKey", async () => {
    let symKey = await crypt.derivePrivateKeyFromPassword(
      universalPassword,
      salt
    );

    let encryptedPrivateKey = await crypt.encryptPrivateKey(
      derivedPrivateKey,
      symKey
    );

    let decryptedPrivateKey = await crypt.decryptPrivateKey(
      encryptedPrivateKey,
      symKey
    );

    assert.equal(derivedPrivateKey, decryptedPrivateKey);
  });
});

it("FOR DERIVATION - Priting correct keys for users to put in firebase", async () => {
  let ericSymKey = await crypt.derivePrivateKeyFromPassword(
    universalPassword,
    ericSalt
  );

  let rickSymKey = await crypt.derivePrivateKeyFromPassword(
    universalPassword,
    rickSalt
  );

  let encryptedPrivateKeyAndIVERIC = await crypt.encryptPrivateKey(
    ericAnderssonPrivateKey,
    ericSymKey
  );
  let encryptedPrivateKeyAndIVRICK = await crypt.encryptPrivateKey(
    slickRickPrivateKey,
    rickSymKey
  );

  //console.log("Private key: " + ericAnderssonPrivateKey)
  //console.log("IV and Encrypted Private Key (eric): " + encryptedPrivateKeyAndIVERIC.iv + "IV" + encryptedPrivateKeyAndIVERIC.encryptedData);
  //console.log("IV and Encrypted Private Key (rick): " + encryptedPrivateKeyAndIVRICK.iv + "IV" + encryptedPrivateKeyAndIVRICK.encryptedData);

  //Not needed, just testing that slice-ing works
  let concatKeyAndIV = "";
  concatKeyAndIV =
    encryptedPrivateKeyAndIVERIC.iv +
    encryptedPrivateKeyAndIVERIC.encryptedData;
  let encryptedData = concatKeyAndIV.slice(44);
  let iv = concatKeyAndIV.slice(0, 44);
  let keyAndIv = { encryptedData, iv };

  let FINALdecryptedPrivateKey = await crypt.decryptPrivateKey(
    keyAndIv,
    ericSymKey
  );

  try {
    let ERICencryptedRecordKey = await crypt.encryptRecordKey(
      ericRecordKey,
      ericAnderssonPublicKey
    );
    let RICKencryptedRecordKey = await crypt.encryptRecordKey(
      ericRecordKey,
      slickRickPublicKey
    );
    //console.log("Erics encrypted recordKey: " + ERICencryptedRecordKey);
    //console.log("Ricks encrypted recordKey: " + RICKencryptedRecordKey);
  } catch (e) {
    console.log("error: " + e);
  }
});
/*
describe("NOT VALID TESTS - Test encryption of file content", () => {
  let newRecordKey = "";
  crypto.generateKey("aes", { length: 256 }, (err, key) => {
    if (err) throw err;

    newRecordKey = key.export().toString("base64");
  });

  //This test is not valid. Everything works except the string " "
  it("Encrypting and decrypting EHR with example keys", async () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (originalData) => {

        

        let stringifiedData = JSON.stringify(originalData);
        //For some reason these two cant have await
        let encryptedData = crypt.encryptEHR(
          exampleRecordKey,
          stringifiedData
        );

        let decryptedData = crypt.decryptEHR(
          exampleRecordKey,
          encryptedData

        );

        assert.equal(stringifiedData, decryptedData);
      })
    );
  });

  it("Encrypting and decrypting EHR with real keys", async () => {
    /**
     * This test is not valid. Everything works except the string " "
     *
     * I want "text => notContains(text, " ")" in property but apparently not instance of Arbitrary..
     * We will never encrypt en empty string so this test with always fail
     *
     
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), async (originalData) => {

        

        let encryptedRecordKey = await crypt.encryptRecordKey(
          newRecordKey,
          derivedPublicKey
        );

        let stringifiedData = JSON.stringify(originalData);
        //console.log(stringifiedData);
        // encryptEHR decrypts the encryptedRecordKey, this throws an error.
        let encryptedData = await crypt.encryptEHR(
          newRecordKey,
          stringifiedData
        );
        console.log("Encrypt Success" + encryptedData.encryptedData);
        let decryptedData = await crypt.decryptEHR(
          newRecordKey,
          encryptedData
        );
        console.log("Decrypt Success: " + decryptedData);
        console.log(stringifiedData == decryptedData);

        assert.equal(stringifiedData, decryptedData);
      })
    );
  }).timeout(10000);

  
});
*/

it("Decrypt Example Record Key with Example Private Key", async () => {
  /**
   * 1. Generate salt for new user
   * 2. Generate keyPair
   * 3. Generate symmetricKey with new salt and universalPassword
   * 4. Generate recordKey and encrypt is with users publicKey
   * 5. Store salt on database
   * 6. Store publicKey on database
   * 7. Store privateKeyAndIv on database
   * 8. Store recordKey on database
   *
   * @author David Zamanian
   */

  let newSalt = crypto.randomBytes(96);
  newSalt = newSalt.toString("base64");
  console.log(
    "------------------------------------------------------------------------------"
  );
  console.log("Salt: " + newSalt);

  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  let privateKey = keyPair.privateKey;
  let publicKey = keyPair.publicKey;

  crypto.generateKey("aes", { length: 256 }, async (err, key) => {
    if (err) throw err;

    let rk = key.export().toString("base64");

    console.log("RecordKey: " + rk);
  });
  //let recordKey1 = "M9woy+60QjZBcuJwQ8ar6aulGDvy5sFYWP1GcdKOdqQ=";
  //let recordKey2 = "vtGihlrGMkRYw06H6E7K+aZOhT0fwu4gaoyGja6kMKk=";
  let recordKey2 = "01fH4E8h/kHIGft88jD8tRFd+f7LeqHSjxSYZ/PLzvs=";

  let encryptedNewRecordKey = await crypt.encryptRecordKey(
    recordKey2,
    publicKey
  );
  console.log("Encrypted recordKey: " + encryptedNewRecordKey);

  console.log("Public key: " + publicKey);

  //3
  let symmetricKey = await crypt.derivePrivateKeyFromPassword(
    universalPassword,
    newSalt
  );
  //4

  let encryptedPrivateKeyAndIV = await crypt.encryptPrivateKey(
    privateKey,
    symmetricKey
  );
  let concatPVandIVToSave = "";
  concatPVandIVToSave =
    encryptedPrivateKeyAndIV.iv + "IV" + encryptedPrivateKeyAndIV.encryptedData;
  //5
  console.log("PrivateKeyAndIv: " + concatPVandIVToSave);

  console.log(
    "------------------------------------------------------------------------------"
  );

  /*
  let dbRef = ref(database);
  const mapUserSnapshot = get(child(dbRef, "mapUser/" + UID));
  const doctorToRecordKeySnapshot = get(
    child(dbRef, "DoctorToRecordKey/" + UID + "/recordKeys/")
  );
  const patientToRecordKeySnapshot = get(
    child(dbRef, "PatientToRecordKey/" + UID + "/recordKey/")
  );

  update(ref(database, "mapUser/" + UID)),
    {
      IVAndPrivateKey: "Test", //concatPVandIVToSave,
      //publicKey: publicKey,
      //salt: newSalt
    };

  
  update(ref(database, "Users/" + uid), {
    phoneNr: phoneNr,
  })
    .then(() => {
      resolve("Phone number updated successfully");
    })
    .catch((error) => {
      reject(error);
    });
*/
});
