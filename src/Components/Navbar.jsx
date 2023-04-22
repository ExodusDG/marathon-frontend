import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import logotype from '../image/logotype.jpeg'
import axios from 'axios'
var qs = require('qs');

function Navbar(props) {

    const [isAdmin, setIsAdmin] = useState(false)

   
        var data = qs.stringify({
            token: window.localStorage.getItem('token')
        })

        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_URL + '/getUserData',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(response)
                if (response.data[0][0].isAdmin === 1) {
                    setIsAdmin(true)
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    return (
        <nav>
            <div className="container">
                <Link className='logotype' to={'/'}><img src={logotype} alt="Logotype" /></Link>

                <div className="menuLink">
                    <Link to={'/groups'} >Groups</Link>
                    <Link to={'/messages'} >Messages</Link>
                    {(isAdmin === true) ? <Link to={'/users'} >Users</Link> : ''}
                    <Link onClick={e => {
                        window.localStorage.setItem('token', '')
                        props.setAuthToken('')
                    }} to={'/login'} >Log out</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;