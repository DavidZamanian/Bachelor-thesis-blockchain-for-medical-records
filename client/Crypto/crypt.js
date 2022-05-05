const crypto = require("crypto");
const { default: EHRDecryptionError } = require("./EHRDecryptionError");
const { default: EHREncryptionError } = require("./EHREncryptionError");
const { default: KeyDecryptionError } = require("./KeyDecryptionError");
const { default: KeyDerivationError } = require("./KeyDerivationError");
const { default: KeyEncryptionError } = require("./KeyEncryptionError");
/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author David Zamanian, Nils Johnsson, Wendy Pau, Christopher Molin
 */

const algorithm = "aes-256-gcm";

/** This method will only be used once per patient (the result will then be stored in the database)
 *
 * @param {*} privateKey This will be pre-generated together with the public key.
 * @param {*} symmetricKey This is derived from the passward and salt of the signed in user
 * @returns {Promise<{iv:*, encryptedData: *}>} the iv concatenated with the encryptedPrivateKey (will be stored in database)
 * @throws {KeyEncryptionError}
 */
async function encryptPrivateKey(privateKey, symmetricKey) {

  try {
    const iv = crypto.randomBytes(32);

    let cipher = crypto.createCipheriv(algorithm, symmetricKey, iv);

    let encryptedPrivateKey = cipher.update(Buffer.from(privateKey, "utf8"));
    encryptedPrivateKey = Buffer.concat([encryptedPrivateKey, cipher.final()]);

    return {
      iv: iv.toString("base64"),
      encryptedData: encryptedPrivateKey.toString("hex"),
    };

  } catch (error) {
    throw new KeyEncryptionError(error.message);
  }
}

/** 
 * Decrypts a private key 
 * @param {{iv:*, encryptedData: *}} encryptedPrivateKeyAndIV Get this from the database
 * @param {*} symmetricKey This is derived from the passward and salt of the signed in user
 * @returns {*} decrypted key
 * @throws {KeyDecryptionError}
 */
async function decryptPrivateKey(encryptedPrivateKeyAndIV, symmetricKey) {

  try {
    
    let iv = Buffer.from(encryptedPrivateKeyAndIV.iv, "base64");
    let encryptedPrivateKey = Buffer.from(
      encryptedPrivateKeyAndIV.encryptedData,
      "hex"
    ); 

    let decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(symmetricKey),
      iv
    );

    // Updating encrypted text
    let decryptedKey = decipher.update(encryptedPrivateKey);

    return decryptedKey; 

  } catch (error) {
    throw new KeyDecryptionError(error.message);
  }
}

/**
 * Encrypts the EHR with the record key using the AES crypto algorithm.
 * @param {string} decryptedRecordKey Encrypted record_key retrieved from DB.
 * @param {string} EHR The EHR text content to be encrypted.
 * @returns {Promise<{iv: string, Tag: Buffer, encryptedData: string}>} The IV for the encryption and the encrypted EHR.
 * @throws {EHREncryptionError}
 */
async function encryptEHR(decryptedRecordKey, EHR) {

  try{
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
  catch(err){
    throw new EHREncryptionError(err.message);
  }
}

/**
 * Decrypts the EHR using the record key.
 * @param {string} decryptedRecordKey Encrypted record_key retrieved from DB.
 * @param {{iv: string, Tag: Buffer, encryptedData: string}} EHR Contains the IV and encrypted EHR.
 * @returns {Promise<string>} The decrypted EHR in string.
 * @throws {EHRDecryptionError}
 */
async function decryptEHR(decryptedRecordKey, EHR) {

  try{
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

  }catch(err){
    throw new EHRDecryptionError(err.message);
  }
}

/**
 * Encrypts the record key using asymmetric encryption. Also used to give permission to the EHR by which users' public key is used.
 * Creating a function to encrypt string
 * @param {string} recordKey A generated symmetric record key.
 * @param {string} publicKey The public key used to encrypt the record key.
 * @returns {Promise<string>} Encrypted record key.
 * @throws {KeyEncryptionError}
 */
async function encryptRecordKey(recordKey, publicKey) {

  try {
    let encrypted = crypto.publicEncrypt(
      publicKey,
      Buffer.from(recordKey, "base64")
    );

    return encrypted.toString("base64");

  } catch (error) {
    throw new KeyEncryptionError(error.message);
  }
}

/**
 * Decrypts the record key using asymmetric encryption.
 * // Creating a function to decrypt string
 * @param {string} recordKey Encrypted record key.
 * @param {string} privateKey A users private key.
 * @returns {Promise<string>} The decrypted record key.
 * @throws {KeyDecryptionError}
 */
async function decryptRecordKey(recordKey, privateKey) {

  try {

    let decrypted = crypto.privateDecrypt(
      privateKey,
      Buffer.from(recordKey, "base64")
    );
  
    return decrypted.toString("base64");

  } catch (error) {
    throw new KeyDecryptionError(error.message);
  }
}

/**
 * Takes the password when logging in for the first time and
 * derives a private key from it.
 *
 * @param {*} password The password of the user login
 * @param {*} salt The salt used in the hasing. This should be stored in database (can be public)
 * @returns {Promise<string>} The privateKey that has been derived from the password
 * @throws {KeyDerivationError}
 */
async function derivePrivateKeyFromPassword(password, salt) {

  try {
    var hexKey;

    var iterations = 1000;
    var outputBitLen = 16;
    var digest = "sha512";

    hexKey = crypto.pbkdf2Sync(password, salt, iterations, outputBitLen, digest);

    return hexKey.toString("hex"); // MUST be HEX format!

  } catch (error) {
    throw new KeyDerivationError(error.message);
  }
}

module.exports = {
  encryptRecordKey,
  decryptRecordKey,
  encryptEHR,
  decryptEHR,
  derivePrivateKeyFromPassword,
  encryptPrivateKey,
  decryptPrivateKey,
};
