import { useEffect, useState } from 'react';
import '../App.css';
import close from '../image/close.svg'
import React from "react";
import moment from 'moment'
import Loading from './Loading';
import axios from 'axios'
import TimePicker from 'react-time-picker';
var qs = require('qs');

function AddMessagePopup(props) {

    const [value, setValue] = useState('');

    const [type, setType] = useState('Nothing')
    const [isUploadVisible, setIsUploadVisible] = useState(false)
    const [time, setTime] = useState('10:00');
    const [file, setFile] = useState(null)
    const [fileLink, setFileLink] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    function addMessage() {

        if (type !== 'Nothing' && file === null) {
            alert('Please select the file!')
        } else {
            if (value.length > 0 && time !== null) {
                var day = props.days[props.currentDay]

                var messageData = {
                    id: day.messages.length + 1,
                    message_type: (type === 'Nothing' || file === null) ? 'Text' : type,
                    message_markup: value,
                    message_source: fileLink,
                    message_text: value,
                    day: day.day,
                    time: moment(time, 'HH:mm').format('LT') === '8:00 AM' ? '8:01 AM' : moment(time, 'HH:mm').format('LT')
                }
                var data = [...props.days];

                data[props.currentDay].messages.push(messageData)

                var result = []

                result = [...data[props.currentDay].messages].sort(function (a, b) {
                    var now = moment();
                    var dateA = moment(Number(moment(a.time, 'LT')));
                    var daysA = moment(dateA).diff(now, 'Minutes');

                    var dateB = moment(Number(moment(b.time, 'LT')));
                    var daysB = moment(dateB).diff(now, 'Minutes');
                    return daysA - daysB;
                })

                data[props.currentDay].messages = result

                props.setDays(data)

                props.setAddMessagePopup(false)

            } else {
                alert('Please fill all fields!')
            }
        }
    }

    function uploadFile(e) {

        if (type === 'Video' && e.target.files[0].size > 50000000) {
            alert('Error! The file must be less than 50MB.')
            setFile('')
        } else {
            setIsLoading(true)
            setFile(e.target.value)

            var data = new FormData();
            data.append('file', e.target.files[0]);

            var config = {
                method: 'post',
                url: process.env.REACT_APP_API_URL + `/uploadFile`,
                data: data
            };

            axios(config)
                .then(function (response) {
                    setIsLoading(false)
                    setFileLink(response.data)
                })
                .catch(function (error) {
                    console.log(error)
                });
        }

    }

    const [characterLimit, setCharacterLimit] = useState(4000)

    function updateCharacterLimit() {
        if (type === 'Nothing') {
            setCharacterLimit(4000)
        } else {
            setCharacterLimit(1000)
            var string = value.substring(0, 1000)
            console.log(string.length)
            setValue(string)
        }
    }

    useEffect(() => {
        updateCharacterLimit()
    }, [type])

    return (
        <div className="userPopup addMSGPopup">
            <div className="userPopupBlock addMessages">
                <img className='closeButton' src={close} alt="Close" onClick={e => props.setAddMessagePopup(false)} />
                <p className='userPopupTitle'>Add Message</p>

                <p className='addMessageRowTitle'>Message Text</p>

                <textarea value={value} placeholder="Message" onChange={e => {

                    if (e.target.value.length > characterLimit) {
                        e.target.value.substring(0, characterLimit)
                        alert('You have exceeded the maximum number of characters')
                    } else {
                        var string = e.target.value.replace(/["]/g,'\'');
                        setValue(string)

                    }

                }}></textarea>
                <p className='leftSymbols'><span>{characterLimit - value.length}</span> symbols left</p>

                <p className='addMessageRowTitle'>Message sending time</p>
                <p className='addMessageRowDesc'>Select the time of day when the message will be sent</p>
                <div className='timePicker'>
                    <TimePicker onChange={setTime} value={time} disableClock={true} />
                </div>

                <p className='addMessageRowTitle'>Attachments</p>
                <p className='addMessageRowDesc'>What do you want to attach?</p>

                <select className='typeSelect' defaultValue={'Nothing'} onChange={e => {
                    setType(e.target.value)
                    if (e.target.value !== 'Nothing') {
                        setFile(null)
                        setIsUploadVisible(true)
                    } else {
                        setIsUploadVisible(false)
                    }
                }} value={type}>
                    <option value="Nothing">Nothing</option>
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                </select>

                {
                    (isUploadVisible === true)
                        ? <input className='inputFile' type="file" value={file} onChange={e => uploadFile(e)} />
                        : ''
                }

                <button className='addMessageButton' onClick={e => addMessage()}>Add Message</button>

            </div>

            {
                (isLoading === true) ? <Loading /> : ''
            }
        </div>
    );
}

export default AddMessagePopup;