import { useState, useEffect } from 'react';
import '../App.css';
import User from '../Components/User';
import axios from 'axios'
import UserPopup from '../Components/UserPopup';
var qs = require('qs');

function Users() {

    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
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

                if (response.data[0][0].isAdmin === 1) {
                    setIsAdmin(true)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])


    const [users, setUsers] = useState([])

    useEffect(() => {

        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_URL + '/getUsers',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        axios(config)
            .then(function (response) {
                response = response.data[0]
                setUsers(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [])

    const [userPopup, setUserPopup] = useState(false)

    return (

        (isAdmin === true)
            ? <div class='mainBlock userWrapper'>
                <div className='userBlockTop'>
                    <h1>Users</h1>
                    <button onClick={e => setUserPopup(true)}>Add User</button>
                </div>

                <div className="usersTable">
                    {
                        users.map(user => (
                            <User data={user} setUsers={setUsers}></User>
                        ))
                    }
                </div>

                {
                    (userPopup === true)
                        ? <UserPopup setUserPopup={setUserPopup} setUsers={setUsers} />
                        : ''
                }

            </div>
            : <p className='userViews'>You do not have permission to view this page!</p>

    );
}

export default Users;
