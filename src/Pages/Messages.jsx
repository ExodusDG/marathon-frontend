import { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios'
import { Link } from 'react-router-dom';
var qs = require('qs');

function Messages() {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_URL + '/getMessages',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        axios(config)
            .then(function (response) {
                response = response.data
                setMessages(response);
                console.log(response)
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [])


    function deleteItem(item) {

        var msg = qs.stringify({
            id: item
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_URL + '/deleteMessages',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: msg
        };

        axios(config)
            .then(function (response) {
                setMessages(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    return (

        <div className='pageWrapper'>


            <div className="pageHeader">
                <h1>Messages</h1>
                <Link to={'/addnewmessage'}><button>Add messages preset</button></Link>
            </div>

            <div className="messagesList">

                {
                    (messages.length > 0)
                        ? messages.map((message, index) => (
                            <div key={index} className='messageItem'>
                                <p className="messageName"><span>Preset name: </span>{message.message_info.message_table}</p>

                                <div className="messageBlockButtons">
                                    <Link to={'/editmessage/' + message.message_info.id}><button>Edit</button></Link>
                                    <button onClick={e => deleteItem(message.message_info.message_table)}>Delete</button>
                                </div>
                            </div>
                        ))
                        : <p>No messages found</p>
                }

            </div>




        </div>

    );
}

export default Messages;
