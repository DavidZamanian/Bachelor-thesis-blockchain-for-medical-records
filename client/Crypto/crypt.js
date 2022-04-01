const crypto = require("crypto");
const fs = require("fs");

/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author David Zamanian, Nils Johnsson, Wendy Pau
 */

const algorithm = "aes-256-gcm";

/**
 * Encrypts the EHR with the record key using the AES crypto algorithm.
 * @param {*} record_key Encrypted record_key retrieved from DB.
 * @param {*} EHR The EHR json file to be encrypted.
 * @param {*} medPers_privKey The medical personnels' private key that writes the EHR.
 * @returns The IV for the encryption and the encrypted EHR.
 */
function encryptEHR(record_key, EHR, medPers_privKey) {
  const decrypted_record_key = decryptRecordKey(record_key, medPers_privKey);
  const iv = crypto.randomBytes(32);

  let cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(decrypted_record_key, "base64"),
    iv
  );

  let encryptedEHR = cipher.update(Buffer.from(EHR, "base64"));
  encryptedEHR = Buffer.concat([encryptedEHR, cipher.final()]);

  return {
    iv: iv.toString("base64"),
    encryptedData: encryptedEHR.toString("base64"),
    Tag: cipher.getAuthTag(),
  };
}

/**
 * Decrypts the EHR using the record key.
 * @param {*} record_key Encrypted record_key retrieved from DB.
 * @param {*} EHR Contains the IV and encrypted EHR.
 * @param {*} privateKey Permissioned private key used to decrypt the record key.
 * @returns The decrypted EHR in string.
 */
function decryptEHR(record_key, EHR, privateKey) {
  const decrypted_record_key = decryptRecordKey(record_key, privateKey);
  let iv = Buffer.from(EHR.iv, "base64");
  let encryptedEHR = Buffer.from(EHR.encryptedData, "base64");

  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(decrypted_record_key, "base64"),
    iv
  );
  decipher.setAuthTag(EHR.Tag);

  // Updating encrypted text
  let decryptedEHR = decipher.update(encryptedEHR, "base64");
  decryptedEHR = Buffer.concat([decryptedEHR, decipher.final()]);

  // returns data after decryption
  return decryptedEHR.toString();
}

/**
 * Encrypts the record key using asymmetric encryption. Also used to give permission to the EHR by which users' public key is used.
 * Creating a function to encrypt string
 * @param {*} record_key A generated symmetric record key.
 * @param {*} publicKeyFile The public key used to encrypt the record key.
 * @returns Encrypted record key.
 */
function encryptRecordKey(record_key, publicKeyFile) {
  const publicKey = fs.readFileSync(publicKeyFile, "utf8");

  // publicEncrypt() method with its parameters
  const encrypted = crypto.publicEncrypt(
    publicKey,
    Buffer.from(record_key, "base64")
  );
  return encrypted.toString("base64");
}

/**
 * Decrypts the record key using asymmetric encryption.
 * // Creating a function to decrypt string
 * @param {*} record_key Encrypted record key.
 * @param {*} privateKeyFile A users private key.
 * @returns The decrypted record key.
 */
function decryptRecordKey(record_key, privateKeyFile) {
  const privateKey = fs.readFileSync(privateKeyFile, "utf8");

  // privateDecrypt() method with its parameters
  const decrypted = crypto.privateDecrypt(
    privateKey,
    Buffer.from(record_key, "base64")
  );
  return decrypted.toString("base64");
}

/**
 * Takes the password when logging in for the first time and
 * derives a private key from it.
 *
 * @param {*} password The password of the user login
 * @param {*} salt The salt used in the hasing. This should be stored in database (can be public)
 * @returns The privateKey that has been derived from the password
 */
function derivePrivateKeyFromPassword(password, salt) {
  var hexKey;
  var iterations = 100000;
  var outputBitLen = 512;
  var hashAlgo = "sha512";

  hexKey = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    outputBitLen,
    hashAlgo
  );
  return hexKey.toString("base64");
}
/**
 * Creates a publicKey from a given privateKey
 * @param {*} privateKey The privateKey that has originally been derived from the user's password
 * @returns The publicKey that has been extracted
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
