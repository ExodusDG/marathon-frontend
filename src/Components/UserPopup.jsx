import { useState } from 'react';
import '../App.css';
import close from '../image/close.svg'
import axios from 'axios'
var qs = require('qs');

function UserPopup(props) {

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [admin, setAdmin] = useState(false)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    function addUser() {

        if (login.length > 0 && password.length > 0) {
            var data = qs.stringify({
                login: login,
                password: password,
                isAdmin: (admin === true) ? 1 : 0,
                first_name: firstName,
                last_name: lastName
            })

            var config = {
                method: 'post',
                url: process.env.REACT_APP_API_URL + '/addAdmin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    props.setUsers(response.data[0])
                    props.setUserPopup(false)
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            alert('Please, fill all fields!')
        }

    }

    return (
        <div className="userPopup">
            <div className="userPopupBlock">
                <img className='closeButton' src={close} alt="Close" onClick={e => props.setUserPopup(false)} />
                <p className='userPopupTitle'>Add User</p>

                <input type="text" className='popupInput' placeholder='Email' value={login} onChange={e => setLogin(e.target.value)} />
                <input type="text" className='popupInput' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                <input type="text" className='popupInput' placeholder='First Name' value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input type="text" className='popupInput' placeholder='Last Name' value={lastName} onChange={e => setLastName(e.target.value)} />
                <input type="checkbox" id='isAdminCheckbox' checked={(admin === true) ? true : false} onClick={e => setAdmin(!admin)} />
                <label htmlFor="isAdminCheckbox">Grant administrator rights</label>

                <button className='addUserButton' onClick={e => addUser()}>Add User</button>
            </div>
        </div>
    );
}

export default UserPopup;