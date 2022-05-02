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

  //console.log("IV: " + iv.toString("base64"));
  //console.log("EncryptedPrivateKey: " + encryptedPrivateKey.toString("hex"));
  return {
    iv: iv.toString("base64"),
    encryptedData: encryptedPrivateKey.toString("hex"),
  };
}

/** Not done yet. This will be called everytime user logs in to get the privateKey.
 *
 * @param {*} encryptedPrivateKeyAndIV Get this from the database
 * @param {*} symmetricKey This is derived from the passward and salt of the signed in user
 * @returns
 */
async function decryptPrivateKey(encryptedPrivateKeyAndIV, symmetricKey) {
  let iv = Buffer.from(encryptedPrivateKeyAndIV.iv, "base64"); //slice(0, 44); //Need to find the end of the IV (30 is not correct i dont think)
  let encryptedPrivateKey = Buffer.from(
    encryptedPrivateKeyAndIV.encryptedData,
    "hex"
  ); //.slice(44);

  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(symmetricKey),
    iv
  );

  // Updating encrypted text
  let decryptedKey = decipher.update(encryptedPrivateKey);
  //decryptedKey = Buffer.concat([decryptedKey, decipher.final()]);

  return decryptedKey; //.toString("base64");
}

/**
 * Encrypts the EHR with the record key using the AES crypto algorithm.
 * @param {string} recordKey Encrypted record_key retrieved from DB.
 * @param {string} EHR The EHR text content to be encrypted.
 * @returns {Promise<{iv: string, Tag: Buffer, encryptedData: string}>} The IV for the encryption and the encrypted EHR.
 */
async function encryptEHR(decryptedRecordKey, EHR) {
  //const decryptedRecordKey = decryptRecordKey(recordKey, privateKey);
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
  //const decryptedRecordKey = decryptRecordKey(recordKey, privateKey);

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
async function encryptRecordKey(recordKey, publicKey) {
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
async function decryptRecordKey(recordKey, privateKey) {
  //const privateKey = fs.readFileSync(privateKeyFile, "utf8");
  // privateDecrypt() method with its parameters

  // console.log("!!!!!PrivateKEy; " + privateKey);

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

  var iterations = 1000;
  var outputBitLen = 16; // this could be wrong
  var digest = "sha512"; // this could be wrong

  hexKey = crypto.pbkdf2Sync(password, salt, iterations, outputBitLen, digest);

  return hexKey.toString("hex"); // MUST be HEX format!
}

/** This will not be needed anymore
 *
 * Creates a publicKey from a given privateKey
 * @param {string} privateKey The privateKey that has originally been derived from the user's password
 * @returns {Promise<string>} The publicKey that has been extracted
 */
/*
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
*/

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

async function generateKeysForUsers() {
  //1
  let newSalt = crypto.randomBytes(96);
  newSalt = newSalt.toString("base64");

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

  crypto.generateKey("aes", { length: 256 }, (err, key) => {
    if (err) throw err;

    newRecordKey = key.export().toString("base64");
  });
  return {
    salt: salt,
    keyParit: keyPair,
  };
}

module.exports = {
  encryptRecordKey,
  decryptRecordKey,
  encryptEHR,
  decryptEHR,
  derivePrivateKeyFromPassword,
  encryptPrivateKey,
  decryptPrivateKey,
  generateKeysForUsers,
};
