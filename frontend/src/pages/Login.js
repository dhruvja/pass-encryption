import React,{useState} from 'react'
import Startbar from './components/Startbar'
import {Segment,Header,Button,Icon,Card,Form,Input,Message} from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'

const crypto = require('crypto-js')


function Login(props) {


    const [cred,setCred] = useState({
        email: '',
        password: ''
    })

    const [expired,setExpired] = useState(false)


    const [privateKey,setPrivateKey] = useState('')

    const [result,setResult] = useState({
        present: false,
        success: '',
        msg: ''
    })

    const handleChange = e => {

        setResult({
            present: false,
            success: '',
            msg: ''
        })

        setCred({
            ...cred,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        var password = crypto.SHA3(cred.password).toString()
        let loginCred = {...cred};
        loginCred.password = password;
        fetch('http://localhost:5000/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginCred)
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.success){
                document.cookie = "token=" + data.token
                var private_key = crypto.SHA256(cred.password + cred.email).toString()
                private_key = crypto.SHA256(private_key + cred.password).toString()
                setPrivateKey(private_key)
            }
            setResult({
                present: true,
                success: data.success,
                msg: data.msg
            })
        })
    }

    console.log(result)

    return (
        <div>
        {result.present && result.success ? <Redirect push to={{
                pathname: "/vault",
                state: {private_key: privateKey}
                }} /> : <div></div>
        }
            <Startbar type="login"/>
            <div className="content">
                <br />
                <Header as="h1">
                    Welcome to Password Keeper
                </Header>
                <br />
                <div className="leftAlign">
                    <Card centered>
                        <Card.Content header='Enter Login Credentials' />
                        <Card.Content>
                            <Card.Description>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Field>
                                    <label>Email</label>
                                    <Input placeholder='someone@example.com' icon="mail" name="email" type="email" onChange={handleChange} value={cred.email} />
                                    </Form.Field>
                                    <Form.Field>
                                    <label>Master Password</label>
                                    <Input placeholder='Password...' icon='lock' name="password" type="password" onChange={handleChange} value={cred.password} />
                                    </Form.Field>
                                    <Button icon type="submit" labelPosition='right' primary>
                                        Unlock
                                        <Icon name='unlock' />
                                    </Button>
                                </Form>
                                <br />
                                {result.present &&
                                    <div>
                                    {result.success ?
                                        <Message positive>
                                            <Message.Header>Success</Message.Header>
                                            <p>{result.msg}</p>
                                        </Message>
                                        :
                                        <Message negative>
                                            <Message.Header>Error</Message.Header>
                                            <p>{result.msg}</p>
                                        </Message>
                                    }
                                    </div>
                                    

                                }
                                {
                                    expired && 
                                    <Message negative>
                                        <Message.Header>Session Expired</Message.Header>
                                        <p>{expired}</p>
                                    </Message>
                                }
                            </Card.Description>
                        </Card.Content>
                        
                    </Card>
                </div>
                
            </div>
            
        </div>
    )
}

export default Login
