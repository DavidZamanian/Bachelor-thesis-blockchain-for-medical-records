const crypto = require("crypto");
const fs = require("fs");

const algorithm = "aes-128-ctr";

function encryptEHR(record_key, plaintext) {
  const iv = crypto.randomBytes(16);

  let cipher = crypto.createCipheriv(algorithm, Buffer.from(record_key), iv);

  let encrypted = cipher.update(plaintext);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decryptEHR(record_key, text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");

  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(record_key),
    iv
  );

  // Updating encrypted text
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // returns data after decryption
  return decrypted.toString();
}

// Creating a function to encrypt string
function encryptRecordKey(plaintext, publicKeyFile) {
  const publicKey = fs.readFileSync(publicKeyFile, "utf8");

  // publicEncrypt() method with its parameters
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(plaintext));

  return encrypted.toString("base64");
}

// Creating a function to decrypt string
function decryptRecordKey(ciphertext, privateKeyFile) {
  const privateKey = fs.readFileSync(privateKeyFile, "utf8");

  // privateDecrypt() method with its parameters
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: "",
    },
    Buffer.from(ciphertext, "base64")
  );

  return decrypted.toString("utf8");
}

module.exports = { encryptRecordKey, decryptRecordKey, encryptEHR, decryptEHR };

/* Method for encryptEHR (symmetric with record_key)

    AES-128 bits counter mode

    */

/* Method for encryptRecordKey (Assymtric with user's public key)

    Eliptic curve??
    Get the public key from firebase make method for retrieving the public key in ApiService

    */
