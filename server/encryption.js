const crypto = require("crypto");

const algorithm = "aes-256-cbc"; 

// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);

// protected data
const message = "This is a secret message";

const email = "dhruvdjain6@gmail.com";
const password = "password@123"

// If the above email and password are correct, the private key is generated from the above credentials

var hash = crypto.createHash('sha256').update(email+password).digest('hex')
console.log(hash)

hash = crypto.createHash('sha256').update(password+hash).digest('hex')

hash = Buffer.from(hash)

hash = hash.slice(32)

// The private key "hash" is used to encrypt and decrypt the passwords
// the cipher function
const cipher = crypto.createCipheriv(algorithm, hash, initVector);

// encrypt the message
// input encoding
// output encoding
let encryptedData = cipher.update(message, "utf-8", "hex");

encryptedData += cipher.final("hex");

console.log("Encrypted message: " + encryptedData);

const decipher = crypto.createDecipheriv(algorithm, hash , initVector);

let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

decryptedData += decipher.final("utf8");

console.log("Decrypted message: " + decryptedData)


