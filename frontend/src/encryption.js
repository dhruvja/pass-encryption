import './App.css';
import React,{useState,useEffect} from 'react'
var crypto = require('crypto-js');

function App() {

  const [credentials,setCredentials] = useState({
    email: '',
    password: '',
    text: ''
  })

  const [keys,setKeys] = useState({
    private: '',
    encrypted: '',
    decrytped: ''
  })

  const handleChange = e => {
    setCredentials({
      ...credentials,
      [e.target.name] : e.target.value
    })
  }

  const cipher = e => {
      var sha = crypto.SHA256(credentials.password).toString()
      console.log(sha)
      console.log(credentials)
      var encrypt = crypto.AES.encrypt(JSON.stringify(credentials.text),sha).toString()
      console.log(encrypt)
      setKeys({
        ...keys,
        private: sha,
        encrypted: encrypt
      })
      // setKeys({
      //   ...keys,
      //   private: sha
      // })
  }

  const decipher = e => {
    var bytes = crypto.AES.decrypt(keys.encrypted, keys.private);
    var decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
    setKeys({
      ...keys,
      decrypted: decryptedData
    })
  }

  return (
    <div className="App">
      <form>
        <input type="text" placeholder="Enter your email" name="email" value={credentials.email}  onChange={handleChange}/>
        <input type="text" placeholder = "Enter your password" name="password" value={credentials.password} onChange={handleChange}/>
        <input type="text" placeholder="Enter the text" name="text" value={credentials.text} onChange={handleChange}/>
        <button type="button" onClick={cipher} >Encrypt</button>
        <button type="button" onClick={decipher}>Decrypt</button>
        <h3>Private Key: {keys.private} </h3>
        <h3>Encrypted Text: {keys.encrypted} </h3>
        <h3>Decrypted Text: {keys.decrypted} </h3>
      </form>
    </div>
  );
}

export default App;
