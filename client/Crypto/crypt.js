const crypto = require("crypto");

/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author David Zamanian, Nils Johnsson, Wendy Pau, Christopher Molin
 */

const algorithm = "aes-256-gcm";

/**
 * Encrypts the EHR with the record key using the AES crypto algorithm.
 * @param {string} recordKey Encrypted record_key retrieved from DB.
 * @param {string} EHR The EHR text content to be encrypted.
 * @param {string} privateKey The medical personnels' private key that writes the EHR.
 * @returns {{iv: string, Tag: Buffer, encryptedData: string}} The IV for the encryption and the encrypted EHR.
 */
function encryptEHR(recordKey, EHR, privateKey) {
  const decryptedRecordKey = decryptRecordKey(recordKey, privateKey);
  const iv = crypto.randomBytes(32);

  let cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(decryptedRecordKey, "base64"),
    iv
  );

  let encryptedEHR = cipher.update(Buffer.from(EHR, "utf8"));
  encryptedEHR = Buffer.concat([encryptedEHR, cipher.final()]);

  return {
    iv: iv.toString("base64"),
    encryptedData: encryptedEHR.toString("hex"),
    Tag: cipher.getAuthTag(),
  };
}

/**
 * Decrypts the EHR using the record key.
 * @param {string} recordKey Encrypted record_key retrieved from DB.
 * @param {{iv: string, Tag: Buffer, encryptedData: string}} EHR Contains the IV and encrypted EHR.
 * @param {string} privateKey Permissioned private key used to decrypt the record key.
 * @returns {string} The decrypted EHR in string.
 */
function decryptEHR(recordKey, EHR, privateKey) {

  const decryptedRecordKey = decryptRecordKey(recordKey, privateKey);

  let iv = Buffer.from(EHR.iv, "base64");
  let encryptedEHR = Buffer.from(EHR.encryptedData, "hex");

  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(decryptedRecordKey, "base64"),
    iv
  );
  decipher.setAuthTag(EHR.Tag);

  // Updating encrypted text
  let decryptedEHR = decipher.update(encryptedEHR);
  decryptedEHR = Buffer.concat([decryptedEHR, decipher.final()]);
  
  // returns data after decryption
  return decryptedEHR.toString();
}

/**
 * Encrypts the record key using asymmetric encryption. Also used to give permission to the EHR by which users' public key is used.
 * Creating a function to encrypt string
 * @param {string} recordKey A generated symmetric record key.
 * @param {string} publicKey The public key used to encrypt the record key.
 * @returns {Promise<string>} Encrypted record key.
 */
function encryptRecordKey(recordKey, publicKey) {

  // publicEncrypt() method with its parameters
  const encrypted = crypto.publicEncrypt(
    publicKey,
    Buffer.from(recordKey, "base64")
  );
  return encrypted.toString("base64");
}

/**
 * Decrypts the record key using asymmetric encryption.
 * // Creating a function to decrypt string
 * @param {string} recordKey Encrypted record key.
 * @param {string} privateKey A users private key.
 * @returns {Promise<string>} The decrypted record key.
 */
function decryptRecordKey(recordKey, privateKey) {
  //const privateKey = fs.readFileSync(privateKeyFile, "utf8");

  // privateDecrypt() method with its parameters
  const decrypted = crypto.privateDecrypt(
    privateKey,
    Buffer.from(recordKey, "base64")
  );
  return decrypted.toString("base64");
}

/**
 * Takes the password when logging in for the first time and
 * derives a private key from it.
 *
 * @param {*} password The password of the user login
 * @param {*} salt The salt used in the hasing. This should be stored in database (can be public)
 * @returns {Promise<string>} The privateKey that has been derived from the password
 */
function derivePrivateKeyFromPassword(password, salt) {
  var hexKey;
  var iterations = 1000;
  var keylen = 632; // this could be wrong
  var digest = "sha512"; // this could be wrong

  hexKey = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    keylen,
    digest
  );
  
  let fakeKey = `-----BEGIN PRIVATE KEY-----
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
  
console.log(fakeKey.indexOf("M"))
console.log(fakeKey.indexOf("T",28))
console.log(fakeKey.indexOf("L",90))
let magicCharacter = fakeKey[27]
let magicNewLine = fakeKey[92]

  let key = fakeKey.slice(0,28);
  for (var i = 0; i < 14; i++){
    let row = hexKey.toString("base64").slice(64*i,(64*i+64))
    key = key.concat(row+magicNewLine)
  }
  key = key.concat(`-----END PRIVATE KEY-----`+magicCharacter);

  // change to return key to manually include -----BEGIN ...

/*
  const privKeyObject = crypto.createPrivateKey({
    key: hexKey,
    format: "pem",
  });

  const privateKey = privKeyObject.export({
    format: "pem",
    type: "pkcs8",
  });

*/
  //return privateKey.toString("base64")
  //return fakeKey;
  return key.toString("base64")
  //return hexKey.toString("base64")
}
/**
 * Creates a publicKey from a given privateKey
 * @param {*} privateKey The privateKey that has originally been derived from the user's password
 * @returns {Promise<string>} The publicKey that has been extracted
 */
function extractPublicKeyFromPrivateKey(privateKey) {
  const pubKeyObject = crypto.createPublicKey({
    key: privateKey,
    format: "pem",
  });

  const publicKey = pubKeyObject.export({
    format: "pem",
    type: "spki",
  });

  return publicKey.toString("base64");
}

module.exports = {
  encryptRecordKey,
  decryptRecordKey,
  encryptEHR,
  decryptEHR,
  derivePrivateKeyFromPassword,
  extractPublicKeyFromPrivateKey,
};