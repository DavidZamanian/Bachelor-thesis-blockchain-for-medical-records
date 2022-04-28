import * as assert from "assert";
import crypto from "crypto";
import * as path from "path";
import crypt from "../client/Crypto/crypt.js";
import JSONService from "../server/jsonHandling/jsonService.js";
import * as fc from "fast-check";

/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author Christopher Molin, David Zamanian
 */

const example_directory = "./test/json_examples";
/*
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

const ericRecordKey = `KuM4sQeaBMXUN4Gpo1qRj1tUhyaAtDqpxXVyoMvgb9w=`
const SlickRickRecordKey = `2BSPncgSPTVKNJ4/zvxCeX33M7oSUl6fOgjhTT6AxpQ=`

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

describe("Test keys", async () => {
  const salt =
    "4E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A46";

  let derivedExamplePublicKey = "";
  /*
  it("Derive PrivateKey from Password & Salt", async () => {
    assert.doesNotThrow(async () => {
      derivedPrivateKey = await crypt.derivePrivateKeyFromPassword(
        universalPassword,
        ericSalt
      );
      //console.log(derivedPrivateKey);
    });
  }).timeout(10000);
  */

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


        let EencryptedRecordKey = crypt.encryptRecordKey(ericRecordKey, ericAnderssonPublicKey);
        let RencryptedRecordKey = crypt.encryptRecordKey(ericRecordKey, slickRickPublicKey);
        //console.log("Erics record_key: " + EencryptedRecordKey)
        //console.log("Ricks record_key: " + RencryptedRecordKey)
      });
    });
  });

  //Not needed (i think)
  it("New Encrypted Record Key is of correct length", async () => {
    encryptedRecordKey = crypt.encryptRecordKey(newRecordKey, derivedPublicKey);
    assert.equal(encryptedRecordKey.length, exampleRecordKey.length);
  });

  //Not needed
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
      ericAnderssonPublicKey
    );
    decryptedRecordKey = await crypt.decryptRecordKey(
      encryptedExampleRecordKey,
      ericAnderssonPrivateKey
    );
    assert.equal(decryptedRecordKey, newRecordKey);
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
        console.log("Private key: " + derivedPrivateKey)
        console.log("Dec: " + decryptedRecordKey)
        console.log("New: " + newRecordKey)
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
        //console.log("Key? : " + derivedPrivateKey.toString("base64"));
        let stringifiedData = JSON.stringify("haskjdhaskd");
        let encryptedData = crypt.encryptEHR(
          exampleRecordKey,
          stringifiedData,
          derivedPrivateKey.toString("base64")
        );
        //console.log("encrypted data: " + encryptedData);
        let decryptedData = crypt.decryptEHR(
          exampleRecordKey,
          encryptedData,
          derivedPrivateKey.toString("base64")
        );
        //console.log("Stringi: " + stringifiedData);
        //console.log("Dec data: " + decryptedData);

        assert.equal(stringifiedData, decryptedData);
      })
    );
  });

  it("New crypto works?", async () => {
    let ericSymKey = await crypt.derivePrivateKeyFromPassword(
      universalPassword,
      ericSalt
    );
    let rickSymKey = await crypt.derivePrivateKeyFromPassword(
      universalPassword,
      rickSalt
    );



    let EencryptedPrivateKey = crypt.encryptPrivateKey(
      ericAnderssonPrivateKey,
      ericSymKey.toString("hex")
    );
    //.log("ERICS Enc privateKey: " + EencryptedPrivateKey.iv + EencryptedPrivateKey.encryptedData);

    let SencryptedPrivateKey = crypt.encryptPrivateKey(
      slickRickPrivateKey,
      rickSymKey.toString("hex")
    );
    //console.log("Ricks Enc privateKey: " + SencryptedPrivateKey.iv + SencryptedPrivateKey.encryptedData);

    let decryptedPrivateKey = await crypt.decryptPrivateKey(
      EencryptedPrivateKey,
      ericSymKey.toString("hex")
    );



    console.log("1: " + ericAnderssonPrivateKey);
    console.log("2: " + decryptedPrivateKey);
    assert.equal(ericAnderssonPrivateKey, decryptedPrivateKey);
  });

  it("Encrypting and decrypting EHR with real keys", async () => {
    const salt =
      "4E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A46";

      const notContains = (text, pattern) => text.indexOf(pattern) = 0;

      /**
       * I want "text => notContains(text, " ")" in property but apparently not instance of Arbitrary..
       * We will never encrypt en empty string so this test with always fail
       * 
       */

    fc.assert(
      fc.property(fc.string({ minLength: 1}), async (originalData) => {
        //_______
        // console.log("DO we get here??????");
        //________

        let encryptedRecordKey = await crypt.encryptRecordKey(
          newRecordKey,
          derivedPublicKey
        );

        let stringifiedData = JSON.stringify("hej"); //JSON.stringify("Hej") //
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
