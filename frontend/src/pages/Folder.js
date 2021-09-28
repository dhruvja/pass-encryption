import React,{useState,useEffect} from 'react'
import {Segment,Header,Icon,Card,Button,Modal,Image,Form,Input,Message} from 'semantic-ui-react'
import Vaultbar from './components/Vaultbar'
import {Link,Redirect} from 'react-router-dom'
const crypto = require('crypto-js')

function Folder(props) {

    var initialState = ''

    try {
        initialState = {
            name: '',
            email: '',
            website: '',
            password: '',
            folder: props.location.state.folder_name,
            notes: ''
        }

    } catch (error) {
        initialState = {
            name: '',
            email: '',
            website: '',
            password: '',
            folder: '',
            notes: ''
        }
    } 

    var pri = ''

    try {
        pri = props.location.state.private_key
    } catch (error) {
        pri = ''
    }

    
    

    const [added,setAdded] = useState('')

    const [folderName,setFolderName] = useState(initialState.folder)

    const [privateKey,setPrivateKey] = useState(pri)

    const [open,setOpen] = useState(false)

    const [pass,setPass] = useState(false)
    
    const [cred,setCred] = useState(initialState)

    const [files,setFiles] = useState([])

    const [expired,setExpired] = useState(false)

    const [presentFile,setPresentFile] = useState({})

    const [present,setPresent] = useState(false)

    const [updateMsg,setUpdateMsg] = useState({
        state: false,
        msg: ''
    })

    const [prevFile,setPrevFile] = useState({})

    const [Index,setIndex] = useState(-1)


    const [type,setType] = useState({
        type: 'password',
        icon: 'eye'
    })

    useEffect(() => {
        var name="token"
        let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
        try {
            console.log(privateKey)
            var folder = folderName
        } catch (error) {
            console.log(error)
        }

        if(folder === '')
            setExpired(true)
        else{
            console.log(token)
            fetch(`http://localhost:5000/folder/${folder}`,{
                headers: {
                    'authorization': token
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                try {
                    if(data.length > 0 && data[0].folder){
                        console.log("hi")
                        setFiles(data)
                        setPresent(true)
                    }
                    else{
                        setExpired(true)
                    }
                } catch (error) {
                    setExpired(true)
                }
                
                // console.log(folders)
            })
        }

        

    },[])

    const handleChange = e => {
        console.log(e.target.value)
        setCred({
            ...cred,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = e => {
        console.log(e.target.value)
        setPresentFile({
            ...presentFile,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        setPresent(false)
        console.log(cred)
        var updatedCred = {...cred}
        var name="token"
        let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
        var master = privateKey
        var password = crypto.AES.encrypt(JSON.stringify(cred.password),master).toString()
        updatedCred.password = password
        fetch('http://localhost:5000/add',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedCred)
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            try {
                if(data.id){
                    setAdded(true)
                    setOpen(false)
                    var name="token"
                    let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
                    var folder_name = folderName
                    console.log(token)
                    fetch(`http://localhost:5000/folder/${folder_name}`,{
                        headers: {
                            'authorization': token
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        setFiles(data)
                        setPresent(true)
                        console.log(files)
                    })
                }
            } catch (error) {
                console.log(error)

            }

        })
    }

    const handleClick = index => (e) => {
        console.log(index)
        setPass(true)
        var dets = {...files[index]}
        setIndex(index)
        const decryptKey = privateKey
        var bytes = crypto.AES.decrypt(dets.password, decryptKey);
        dets.password = JSON.parse(bytes.toString(crypto.enc.Utf8));
        setPresentFile(dets)
        setPrevFile(dets)
    }

    const handleType = e => {
        if(type.type === 'password') 
            setType({type: 'text', icon: 'eye slash'})
        else
            setType({type: 'password', icon: 'eye'})
    }

    const recordUpdate = e => {
        if(JSON.stringify(prevFile) === JSON.stringify(presentFile)){
            console.log(prevFile)
            setUpdateMsg({
                state: true,
                msg: 'Nothing to Update'
            })
            }
        else{
            console.log(presentFile)
            var name = "token"
            let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
            var deti = {...presentFile}
            var master = privateKey
            var password = crypto.AES.encrypt(JSON.stringify(presentFile.password),master).toString()
            deti.password = password
            console.log(deti)
            fetch('http://localhost:5000/updatefile',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':  token
                },
                body: JSON.stringify(deti)
            }).then(res => res.json())
            .then(data => {
                setUpdateMsg({
                    state: true,
                    msg: 'Record Updated Successfully'
                })
                var det = files
                det[Index] = data
                setFiles(det)
                console.log(data)
                var bytes = crypto.AES.decrypt(data.password, privateKey);
                data.password = JSON.parse(bytes.toString(crypto.enc.Utf8));
                setPrevFile(data)
                setPresent(true)
            })
        }
    }

    return (
        <div className="vault">
        {
            expired && 
            <Redirect to={{
                pathname: "/",
                state: {expired: "Session has expired, Please login to continue" }
            }} />
        }
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>Add A New Password</Modal.Header>
            <Modal.Description className="padding">
                <Form onSubmit={handleSubmit}>
                    <Form.Field>
                        <label>Name</label>
                        <Input placeholder='Name...' icon="user" name="name" type="text" onChange={handleChange} value={cred.name} />
                    </Form.Field>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Email</label>
                            <Input placeholder='someone@example.com' icon="mail" name="email" type="email" onChange={handleChange} value={cred.email} />
                        </Form.Field>
                        <Form.Field>
                            <label>Webiste</label>
                            <Input placeholder='http://something.com' icon="globe" name="website" type="url" onChange={handleChange} value={cred.website} />
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                        <label>Password</label>
                        <Input placeholder='Password...' icon="lock" name="password" type="password" onChange={handleChange} value={cred.password} />
                    </Form.Field>
                    <Form.Field>
                        <label>Folder</label>
                        <Input placeholder={cred.folder} icon="folder" name="folder" type="text" onChange={handleChange} value={cred.folder} />
                    </Form.Field>
                    <Form.TextArea label='Notes' name="notes" placeholder='Any Comments...'  onChange={handleChange} value={cred.notes} />
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" positive>
                        Add
                    </Button>
                </Form>
            </Modal.Description>
        </Modal>
        <Modal
            onClose={() => setPass(false)}
            onOpen={() => setPass(true)}
            open={pass}
        >
            <Modal.Header>Password Details</Modal.Header>
            <Modal.Description className="padding">
                {/* <p><b>Name: </b>{presentFile.name}</p>
                <p><b>Email: </b>{presentFile.email}</p>
                <p><b>Password: </b>{presentFile.password}</p>
                <p><b>Website: </b>{presentFile.website}</p>
                <p><b>Folder: </b>{presentFile.folder}</p>
                <p><b>Notes: </b>{presentFile.notes}</p> */}
                <Form onSubmit={recordUpdate} >
                    <Form.Field>
                        <label>Name</label>
                        <Input placeholder={presentFile.name}  onChange={handleUpdate} icon="user" name="name" type="text" value={presentFile.name}/>
                    </Form.Field>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Email</label>
                            <Input placeholder='someone@example.com' onChange={handleUpdate} icon="mail" name="email" type="email" value={presentFile.email}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Webiste</label>
                            <Input placeholder='http://something.com' onChange={handleUpdate} icon="globe" name="website" type="url" value={presentFile.website}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                        <label>Password</label>
                        <Input placeholder='Password...' onChange={handleUpdate} icon="lock" name="password" type={type.type} value={presentFile.password} action>
                            <input />
                            <Button icon type="button" onClick={handleType}><Icon name={type.icon}/></Button>
                        </Input>
                    </Form.Field>
                    {/* <Input type='text' placeholder='Search...' action>
                        <input />
                        <Button type='submit'>Search</Button>
                    </Input> */}
                    <Form.Field>
                        <label>Folder</label>
                        <Input placeholder={presentFile.folder} onChange={handleUpdate} icon="folder" name="folder" type="text" value={presentFile.folder} />
                    </Form.Field>
                    <Form.TextArea label='Notes' onChange={handleUpdate} name="notes" placeholder='Any Comments...'  value={presentFile.notes} />
                    <Button onClick={() => setPass(false)}>Cancel</Button>
                    <Button type="submit" positive>
                        Update
                    </Button>
                    { updateMsg.state &&
                    <Message positive>
                        <Message.Header>Message</Message.Header>
                        <p>
                        {updateMsg.msg}
                        </p>
                    </Message>
                    }
                </Form>
            </Modal.Description>
        </Modal>

            <Vaultbar type="folder" private = {privateKey} />
            <Header as="h1">
                Welcome to Your Vault
            </Header>
            <br />
            <div className="content">
                <div className="leftAlign">
                    <Segment padded>
                    { added &&
                    <Message positive>
                        <Message.Header>Item Added Successfully</Message.Header>
                        <p>
                        The details were uploaded successfully
                        </p>
                    </Message>
                    }
                        <Header as="h3" dividing>
                            Passwords
                        </Header>
                        <Segment placeholder>
                            <Button icon type="button" labelPosition='right' onClick={() => setOpen(true)} primary>
                                Add A New Password
                                <Icon name='lock' />
                            </Button>
                        </Segment>
                        <Header as="h3" dividing>
                            {folderName}
                        </Header>
                        <br />
                        <Card.Group itemsPerRow={3}>
                        { present && files.length > 0 && 
                            files.map((row,index) => {
                                return (
                                    <Card onClick={handleClick(index)}>
                                        {/* <Link to="/"> */}
                                            {/* <Header className="padding" as="h3" dividing>{row.folder}</Header> */}
                                            <Card.Content header={row.name} />
                                            <Card.Content>
                                                <Icon name='file alternate' size='massive' inverted color="blue"  />
                                            </Card.Content>
                                        {/* </Link> */}
                                    </Card>
                                )
                            })
                        }
                        </Card.Group>
                    </Segment>
                    <br /><br /><br />
                </div>
            </div>
        </div>
    )
}

export default Folder
