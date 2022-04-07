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
 * @param {{iv: Buffer, Tag: Buffer, encryptedData: string}} EHR Contains the IV and encrypted EHR.
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
 * @returns {string} Encrypted record key.
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
 * @returns {string} The decrypted record key.
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
  var iterations = 10000;
  var outputBitLen = 632;
  var hashAlgo = "sha512";

  hexKey = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    outputBitLen,
    hashAlgo
  );
  


  let key = `-----BEGIN PRIVATE KEY-----\n`;
  for (var i = 0; i < 14; i++){
    let row = hexKey.toString("base64").slice(64*i,(64*i+64))
    key = key.concat(row+"\n")
  }
  key = key.concat(`-----END PRIVATE KEY-----\n`);


  return key.toString("base64")//hexKey.toString("base64")
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