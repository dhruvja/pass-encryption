import React,{useState} from 'react'
import {Segment,Menu} from 'semantic-ui-react'
import {Link,Redirect} from 'react-router-dom'

function Vaultbar(props) {

    const [logout, setLogout] = useState(false)

    const handleItemClick = () => {
        console.log("Item Clicked")
    }

    const handleLogout = e => {
        var c = document.cookie.split("; ");
        var i=0;
        for (i in c) 
            document.cookie =/^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"; 
        setLogout(true)
    }

    return (
        <div>
        {logout && 
            <Redirect to="/" />
        }
            <Segment inverted>
                <Menu inverted pointing secondary>
                <Link to={{
                    pathname: '/vault',
                    state: {private_key: props.private}
                }}>
                    <Menu.Item
                        name='Home'
                        active={props.type === 'home'}
                        onClick={handleItemClick}
                    />
                </Link>
                <Link to="/register">
                    <Menu.Item
                        name='Strength'
                        active={props.type === 'strength'}
                        onClick={handleItemClick}
                    />
                </Link>
                <Link to="/register">
                    <Menu.Item
                        name='Add Item'
                        active={props.type === 'additem'}
                        onClick={handleItemClick}
                    />
                </Link>
                <Menu.Item
                    position='right'
                    name='Logout'
                    active={props.type === 'logout'}
                    onClick={handleLogout}
                />
                
                </Menu>
            </Segment>
        </div>
    )
}

export default Vaultbar
