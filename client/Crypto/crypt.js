const crypto = require("crypto");
/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author David Zamanian, Nils Johnsson, Wendy Pau, Christopher Molin
 */

const algorithm = "aes-256-gcm";

/** This method will only be used once per patient (the result will then be stored in the database)
 *
 * @param {*} privateKey This will be pre-generated together with the public key.
 * @param {*} symmetricKey This is derived from the passward and salt of the signed in user
 * @returns the iv concatenated with the encryptedPrivateKey (will be stored in database)
 */

async function encryptPrivateKey(privateKey, symmetricKey) {
  const iv = crypto.randomBytes(32);

  let cipher = crypto.createCipheriv(algorithm, symmetricKey, iv);

  let encryptedPrivateKey = cipher.update(Buffer.from(privateKey, "utf8"));
  encryptedPrivateKey = Buffer.concat([encryptedPrivateKey, cipher.final()]);

  return {
    iv: iv.toString("base64"),
    encryptedData: encryptedPrivateKey.toString("hex"),
  };
}

/** This will be called everytime user logs in to get the privateKey.
 *
 * @param {*} encryptedPrivateKeyAndIV Get this from the database
 * @param {*} symmetricKey This is derived from the passward and salt of the signed in user
 * @returns
 */
async function decryptPrivateKey(encryptedPrivateKeyAndIV, symmetricKey) {
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

  let decryptedKey = decipher.update(encryptedPrivateKey);

  return decryptedKey;
}

/**
 * Encrypts the EHR with the record key using the AES crypto algorithm.
 * @param {string} recordKey Encrypted record_key retrieved from DB.
 * @param {string} EHR The EHR text content to be encrypted.
 * @returns {Promise<{iv: string, Tag: Buffer, encryptedData: string}>} The IV for the encryption and the encrypted EHR.
 */
async function encryptEHR(decryptedRecordKey, EHR) {
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
 * @returns {Promise<string>} The decrypted EHR in string.
 */
async function decryptEHR(decryptedRecordKey, EHR) {
  let iv = Buffer.from(EHR.iv, "base64");
  let encryptedEHR = Buffer.from(EHR.encryptedData, "hex");

  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(decryptedRecordKey, "base64"),
    iv
  );
  decipher.setAuthTag(EHR.Tag);

  let decryptedEHR = decipher.update(encryptedEHR);
  decryptedEHR = Buffer.concat([decryptedEHR, decipher.final()]);

  return decryptedEHR.toString();
}

/**
 * Encrypts the record key using asymmetric encryption. Also used to give permission to the EHR by which users' public key is used.
 * Creating a function to encrypt string
 * @param {string} recordKey A generated symmetric record key.
 * @param {string} publicKey The public key used to encrypt the record key.
 * @returns {Promise<string>} Encrypted record key.
 */
async function encryptRecordKey(recordKey, publicKey) {
  const encrypted = crypto.publicEncrypt(
    publicKey,
    Buffer.from(recordKey, "base64")
  );
  return encrypted.toString("base64");
}

/**
 * Decrypts the record key using asymmetric encryption.
 * @param {string} recordKey Encrypted record key.
 * @param {string} privateKey A users private key.
 * @returns {Promise<string>} The decrypted record key.
 */
async function decryptRecordKey(recordKey, privateKey) {
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
async function derivePrivateKeyFromPassword(password, salt) {
  var hexKey;

  var iterations = 1000; //Should be longer in a real world implementation
  var outputBitLen = 16;
  var digest = "sha512";

  hexKey = crypto.pbkdf2Sync(password, salt, iterations, outputBitLen, digest);

  return hexKey.toString("hex");
}

/**
 * Takes a string and hashes it using sha256 algorithm.
 * @param {String} the string to hash
 * @returns {Promise<String>} Hashed string in hex format.
 */
async function hashString(string) {
  const hash = crypto.createHash("sha256");
  hash.update(string);
  return hash.digest("hex");
}

module.exports = {
  encryptRecordKey,
  decryptRecordKey,
  encryptEHR,
  decryptEHR,
  derivePrivateKeyFromPassword,
  encryptPrivateKey,
  decryptPrivateKey,
  hashString,
};
