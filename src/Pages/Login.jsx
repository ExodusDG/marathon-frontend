import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import { Navigate } from 'react-router-dom';
import logotype from '../image/logotype.jpeg'
import axios from 'axios'
var qs = require('qs');

function Login(props) {

    /* FORM ALIGNMENT */

    var windowHeight = window.innerHeight;
    const [height, setHeight] = useState(0);
    const formRef = useRef(null);

    useEffect(() => {
        setHeight(formRef.current.clientHeight);
    }, []);

    /* AUTH LOGIC */

    const [login, setLogin] = useState('')
    const [pass, setPass] = useState('')
    const [authStatus, setAuthStatus] = useState('')

    function userAuth() {

        /* AUTH REQUEST */

        var data = qs.stringify({
            'login': login,
            'password': pass
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_URL + '/login',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                setAuthStatus(response.data.answer)
                window.localStorage.setItem('token', response.data.token)
                window.localStorage.setItem('name', response.data.name)
                props.setAuthToken(response.data.token)
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    return (
        <section className='loginPage'>
            <div className="loginForm" ref={formRef} style={{ top: ((windowHeight - height) / 4)}}>
                <img className='loginLogotype' src={logotype} alt="Logotype" />

                <input type='text' placeholder='Login' label='Username' value={login} onChange={e => setLogin(e.target.value)} />
                <input type='password' placeholder='Password' label='Password' onChange={e => setPass(e.target.value)} />

                <p className='authStatus'>{authStatus}</p>

                <button onClick={e => userAuth()}>Login</button>
            </div>
            {
                (authStatus === 'Authorization is successful' ? <Navigate to={'/'} /> : '')
            }
        </section>
    );
}

export default Login;
