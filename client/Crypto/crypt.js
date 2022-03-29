const crypto = require("crypto");
const fs = require("fs");

/**
 * Methods for encrypting/decrypting EHR and record keys.
 * @author David Zamanian, Nils Johnsson, Wendy Pau
 */

//Change to GCM or CCM
const algorithm = "aes-128-ctr";

/**
 * Encrypts the EHR with the record key using the AES crypto algorithm.
 * @param {*} record_key Encrypted record_key retrieved from DB.
 * @param {*} EHR The EHR json file to be encrypted.
 * @param {*} medPers_privKey The medical personnels' private key that writes the EHR.
 * @returns The IV for the encryption and the encrypted EHR.
 */
function encryptEHR(record_key, EHR, medPers_privKey) {
  const decrypted_record_key = decryptRecordKey(record_key, medPers_privKey);

  const iv = crypto.randomBytes(16);

  let cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(decrypted_record_key),
    iv
  );

  let encryptedEHR = cipher.update(EHR);

  encryptedEHR = Buffer.concat([encryptedEHR, cipher.final()]);

  return {
    iv: iv.toString("hex"),
    encryptedData: encryptedEHR.toString("hex"),
  };
}

/**
 * Decrypts the EHR using the record key.
 * @param {*} record_key Encrypted record_key retrieved from DB.
 * @param {*} EHR Contains the IV and encrypted EHR.
 * @param {*} privateKey Permissioned private key used to decrypt the record key.
 * @returns The decrypted EHR.
 */
function decryptEHR(record_key, EHR, privateKey) {
  const decrypted_record_key = decryptRecordKey(record_key, privateKey);
  let iv = Buffer.from(EHR.iv, "hex");
  let encryptedEHR = Buffer.from(EHR.encryptedData, "hex");

  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(decrypted_record_key),
    iv
  );

  // Updating encrypted text
  let decryptedEHR = decipher.update(encryptedEHR);
  decryptedEHR = Buffer.concat([decryptedEHR, decipher.final()]);

  // returns data after decryption
  return decryptedEHR.toString();
}

/**
 * Encrypts the record key using asymmetric encryption. Also used to give permission to the EHR by which users' public key is used.
 * Creating a function to encrypt string
 * @param {*} plaintext A generated symmetric record key.
 * @param {*} publicKeyFile The public key used to encrypt the record key.
 * @returns Encrypted record key.
 */
function encryptRecordKey(plaintext, publicKeyFile) {
  const publicKey = fs.readFileSync(publicKeyFile, "utf8");

  // publicEncrypt() method with its parameters
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(plaintext));

  return encrypted.toString("base64");
}

/**
 * Decrypts the record key using asymmetric encryption.
 * // Creating a function to decrypt string
 * @param {*} record_key Encrypted record key.
 * @param {*} privateKey A users private key.
 * @returns The decrypted record key.
 */
function decryptRecordKey(record_key, privateKey) {
  // privateDecrypt() method with its parameters
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
    },
    Buffer.from(record_key, "base64")
  );

  return decrypted.toString("utf8");
}

function decryptRecordKeyTEST(ciphertext, privateKeyFile) {
  const privateKey = fs.readFileSync(privateKeyFile, "utf8");

  // privateDecrypt() method with its parameters
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
    },
    Buffer.from(ciphertext, "base64")
  );

  return decrypted.toString("utf8");
}

module.exports = {
  encryptRecordKey,
  decryptRecordKey,
  decryptRecordKeyTEST,
  encryptEHR,
  decryptEHR,
};

/* Method for encryptEHR (symmetric with record_key)

    AES-128 bits counter mode

    */

/* Method for encryptRecordKey (Assymtric with user's public key)

    Eliptic curve??
    Get the public key from firebase make method for retrieving the public key in ApiService

    */
