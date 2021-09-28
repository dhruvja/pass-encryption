import React,{useState,useEffect} from 'react'
import {Segment,Header,Icon,Card,Button,Modal,Image,Form,Input,Message} from 'semantic-ui-react'
import Vaultbar from './components/Vaultbar'
import {Link,Redirect} from 'react-router-dom'
const crypto = require('crypto-js')

function Vault(props) {

    const initialState = {
        name: '',
        email: '',
        website: '',
        password: '',
        folder: '',
        notes: ''
    }

    const [added,setAdded] = useState('')

    const [open,setOpen] = useState(false)
    
    const [cred,setCred] = useState(initialState)

    const [folders,setFolders] = useState([])

    const [present,setPresent] = useState(false)

    const [expired,setExpired] = useState(false)

    useEffect(() => {
        var name="token"
        // console.log(props.location.state.private_key)
        let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
        console.log(token)
        fetch('http://localhost:5000/vault',{
            headers: {
                'authorization': token
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            try {
                if(data.length == 0 || data[0].folder){
                    console.log("hi")
                    setFolders(data)
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

    },[])

    const handleChange = e => {
        console.log(e.target.value)
        setCred({
            ...cred,
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
        var master = props.location.state.private_key
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
                    console.log(token)
                    fetch('http://localhost:5000/vault',{
                        headers: {
                            'authorization': token
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        setFolders(data)
                        setPresent(true)
                        console.log(folders)
                    })
                }
            } catch (error) {
                console.log(error)

            }

        })
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
                        <Input placeholder='Folder...' icon="folder" name="folder" type="text" onChange={handleChange} value={cred.folder} />
                    </Form.Field>
                    <Form.TextArea label='Notes' name="notes" placeholder='Any Comments...'  onChange={handleChange} value={cred.notes} />
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" positive>
                        Add
                    </Button>
                </Form>
            </Modal.Description>
        </Modal>
            <Vaultbar type="home" />
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
                            Folders
                        </Header>
                        <br />
                        <Card.Group itemsPerRow={3}>
                        { present && folders.length > 0 && 
                            folders.map((row,index) => {
                                return (
                                    <Card>
                                        {/* <Link to="/"> */}
                                            {/* <Header className="padding" as="h3" dividing>{row.folder}</Header> */}
                                            <Card.Content header={row.folder} />
                                            <Card.Content>
                                                <Link to={{
                                                    pathname: '/folder',
                                                    state: {folder_name: row.folder,private_key: props.location.state.private_key}
                                                }}>
                                                    <Icon name='folder' size='massive' inverted color="blue" />
                                                </Link>
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

export default Vault
