import React,{useState} from 'react'
import {Segment,Header,Form,Input,Icon,Button,Message} from 'semantic-ui-react'
import Startbar from './components/Startbar'
var crypto = require('crypto-js')

function Register() {

    const [cred,setCred] = useState({
        username : '',
        email: '',
        password1: '',
        password2: '',
    })

    const [error,setError] = useState({
        error: false,
        msg: ''
    })

    const [success,setSuccess] = useState({
        success: false,
        msg: ''
    })

    const handleChange = e => {
        setCred({
            ...cred,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        if(cred.password1 != cred.password2){
            setError({
                ...error,
                error: true,
                msg: "Passwords do not match"
            })
        }
        else{
            var password = crypto.SHA3(cred.password1).toString()
            var list = cred;
            list.password1 = password
            setError({
                error: false,
                msg: ''
            })
            setSuccess({
                success: false,
                msg: ''
            })
            fetch('http://localhost:5000/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(list)
            }).then(res => res.json())
            .then(data => {
                console.log(data)
                setSuccess({
                    success: true,
                    msg: 'Account Created Successfully'
                })
            })

        }

        

    }

    return (
        <div>
            <Startbar type="register" />
            <Header as="h1">
                Register With Password Keeper
            </Header>
            <br />
            <div className="content" >
                <Segment padded>
                    <div className="leftAlign">
                        <Header as="h3" dividing>
                            Register with us
                        </Header>
                        <Form onSubmit={handleSubmit} >
                            <Form.Field>
                                <label>Username</label>
                                <Input placeholder='Username...' name="username" icon="user" type="text" onChange={handleChange} value={cred.username} />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <Input placeholder='someone@example.com' icon="mail" name="email" type="email" onChange={handleChange} value={cred.email} />
                            </Form.Field>
                            <Form.Group widths={2}>
                                <Form.Field>
                                    <label>Password</label>
                                    <Input placeholder='Password...' icon="lock" name="password1" type="password" onChange={handleChange} value={cred.password1} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Confirm Password</label>
                                    <Input placeholder='Password...' icon="lock" name="password2" type="password" onChange={handleChange} value={cred.password2} />
                                </Form.Field>
                            </Form.Group>
                            {   error.error && 
                                <Message negative>
                                    <Message.Header>Error Occured</Message.Header>
                                    <p>{error.msg}</p>
                                </Message>
                            }
                            {   success.success && 
                                <Message positive>
                                    <Message.Header>Success</Message.Header>
                                    <p>{success.msg}</p>
                                </Message>
                            }
                            <Button icon type="submit" labelPosition='right' primary>
                                Create Account
                                <Icon name='unlock' />
                            </Button>
                        </Form>
                    </div>
                </Segment>
            </div>
            
        </div>
    )
}

export default Register
