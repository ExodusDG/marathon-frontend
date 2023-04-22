import '../App.css';
import axios from 'axios'
var qs = require('qs');

function User(props) {
    var user = props.data

    function deleteUser() {
        var data = qs.stringify({
            login: props.data.login
        })

        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_URL + '/removeAdmin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                props.setUsers(response.data[0])
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="userBlock">
            <div>
                <p><span>Email:</span> {user.login}</p>
                <p><span>First & Last Name:</span> {user.first_name + ' ' + user.last_name}</p>
                <p><span>Role:</span> {(user.isAdmin === 1) ? 'Admin' : 'User'}</p>
            </div>
            <svg onClick={e => deleteUser()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
        </div>
    );
}

export default User;