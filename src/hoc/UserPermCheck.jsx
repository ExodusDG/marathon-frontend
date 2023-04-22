import axios from 'axios'
var qs = require('qs');

const UserPermCheck = ({ children }) => {

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

            console.log(response.data[0][0].isAdmin)

            if (response.data[0][0].isAdmin === 1) {
                return children;
            } else {
                return 'You dont have'
            }


        })
        .catch(function (error) {
            console.log(error);
        });
}

export default UserPermCheck; 