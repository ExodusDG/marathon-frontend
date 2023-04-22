import { useEffect, useState } from 'react';
import '../App.css';
import AddMessagePopup from '../Components/AddMessagePopup';
import EditMessagePopup from '../Components/EditMessagePopup';
import { Link } from 'react-router-dom';
import axios from 'axios'
var qs = require('qs');

function EditMessage() {

    const messageID = window.location.pathname.toString().replace('/editmessage/', '');


    const [addMessagePopup, setAddMessagePopup] = useState(false)

    const [days, setDays] = useState([])

    const [presetName, setPresetName] = useState('')

    useEffect(() => {

        var msg = qs.stringify({
            id: messageID
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_URL + '/getMessagesData',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: msg
        };

        axios(config)
            .then(function (response) {
                var data = response.data
                var messages = data.messages
                console.log(data)
                setPresetName(data.name)

                var daysArray = [];

                var dayslist = [];

                messages.forEach(element => {
                    if (dayslist.indexOf(element.day) === -1) {
                        dayslist.push(element.day)
                    }
                });

                dayslist.forEach(element => {
                    daysArray.push({
                        day: element,
                        messages: []
                    })
                });

                daysArray.forEach(element => {

                    element.messages = messages.filter(item => item.day === element.day)
                });
                setDays(daysArray)

            })
            .catch(function (error) {
                console.log(error);
            });

    }, [])


    function deleteMessage(day, message) {
        var result = [];
        result.push(day.messages.filter(item => item.message_text !== message))
        day.messages = result;
        const index = days.findIndex((item) => item.day === day.day)
        var test = [...days];

        test.forEach((element, item_index) => {
            if (item_index === index) {
                element.messages = result[0];
            }
        });
        setDays(test)
    }

    const [currentDay, setCurrentDay] = useState('')
    const [editMessagePopup, setEditMessagePopup] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')
    const [msgData, setMSGData] = useState([])

    function sendData() {
        if (presetName.length > 0) {

            var data = {
                presetName: presetName,
                messages: []
            }

            days.forEach(element => {
                element.messages.forEach(message => {
                    data.messages.push(message)
                });
            });


            var msg = qs.stringify(data);
            var config = {
                method: 'post',
                url: process.env.REACT_APP_API_URL + '/addMessages',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: msg
            };

            axios(config)
                .then(function (response) {
                    console.log(response.data)
                    window.location.href = '/messages';
                })
                .catch(function (error) {
                    console.log(error);
                });


        } else {
            alert('Please fill all fields!')
        }
    }

    return (

        <div className='pageWrapper'>

            <div className="pageHeader">
                <h1>{(presetName.length > 0) ? presetName : 'Add Messages'}</h1>
                <div>
                    <button onClick={e => sendData()}>Save</button>
                    <Link to={'/messages'}><button className='addMessageCancel' >Back</button></Link>
                </div>
            </div>

            <p className='dailyMessages'>Days</p>
            <div className="daysList">

                {
                    days.map((day, index) => (
                        <div className="dayItem" key={index}>
                            <p>Day: <span>{day.day}</span></p>
                            <span>Messages: </span>

                            <div className="dayMessagesList">

                                {
                                    (day.messages !== undefined)
                                        ? day.messages.map((message, msg_index) => (

                                            <button className="messagesItem" key={msg_index}>
                                                <p>{message.time}</p>
                                                <p className='messageTextPreview'>{message.message_text}</p>
                                                <span className='messageAddItemIcons'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onClick={e => {
                                                        setCurrentDay(index)
                                                        setCurrentMessage(message.id)
                                                        setMSGData(message)
                                                        setEditMessagePopup(true)
                                                    }}>
                                                        <path fill='#124a81' d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                                    </svg>

                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={e => deleteMessage(day, message.message_text)}>
                                                        <path d="M13 1L1 13M1 1L13 13" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            </button>

                                        ))
                                        : ''
                                }

                                <button className="messagesItem messageAdd" onClick={e => {
                                    setCurrentDay(index)
                                    setAddMessagePopup(true)
                                }}>Add new message</button>
                            </div>
                        </div>
                    ))
                }


                <div className="addDayBlock" onClick={e => {

                    setDays([...days, {
                        day: days.length + 1,
                        messages: []
                    }])

                    console.log(days)
                }}>
                    <p>ADD</p>
                    <p>new day</p>
                </div>
            </div>

            {
                (addMessagePopup === true) ? <AddMessagePopup setAddMessagePopup={setAddMessagePopup} days={days} setDays={setDays} currentDay={currentDay} /> : ''
            }

            {
                (editMessagePopup === true) ? <EditMessagePopup currentMessage={currentMessage} setEditMessagePopup={setEditMessagePopup} days={days} setDays={setDays} currentDay={currentDay} msgData={msgData} /> : ''
            }

        </div>

    );
}

export default EditMessage;
