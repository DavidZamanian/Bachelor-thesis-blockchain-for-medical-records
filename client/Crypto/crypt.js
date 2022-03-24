const crypto = require('crypto');

const algorithm = "aes-128-ctr";

function encryptRecordKey(publicKey, plaintext) {
  const iv = crypto.randomBytes(16);

  let cipher = crypto.createCipheriv(algorithm, Buffer.from(publicKey), iv);

  let encrypted = cipher.update(plaintext);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decryptRecordKey(privateKey, text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");

  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(privateKey),
    iv
  );

  // Updating encrypted text
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // returns data after decryption
  return decrypted.toString();
}

module.exports = { encryptRecordKey, decryptRecordKey };

/* Method for encryptEHR (symmetric with record_key)

    AES-128 bits counter mode

    */

/* Method for encryptRecordKey (Assymtric with user's public key)

    Eliptic curve??
    Get the public key from firebase make method for retrieving the public key in ApiService

    */
