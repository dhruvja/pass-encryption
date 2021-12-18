# Password Keeper
This app can store passwords in an encrypted format. Users can create multiple folders and store passwords accordingly.

### Procedure
 - The user has to create an account by entering his/her email and a master password.
 - The master password is used to generate the private key which can be used to encrypt and decrypt the stored passwords
 - Fill the forms accordingly to store passwords in the required folders

### Encryption
 - Advanced Encryption Standard (AES256) is used for encryption and decryption of the stored passwords using a private key which is derived by taking random characters from master password and hashing so it can be used to derive the master password.
 - The master password is stored using Secure Hashing algorithm (SHA3) but not with salting.
 
### Libraries
  - Crypto-JS: This library is used for encryption and decryption on the client side
  - Crypto: This library is used to hash the passwords on the server side
  - Semantic-ui-react: This library is used as the css framework
  
### Technologies
  - Frontend: React with JS
  - Server: Express JS (Node JS)
  - Database: PostgreSQL
  
### Problems
  - The json web tokens use to authenticate users are currently stored in cookies which are vulnerable to XSS and CSRF attacks. I am looking forward in storing the tokens in http only cookie which are difficult to hamper with.
  - The private key used for encryption and decryption are passed to each page through the state which once lost should be generated again. On the bright side it looks more secure but its not user friendly. Looking for storing the keys in http only cookies.
  - Salting should be used to store the master passwords. Currently not using them.
