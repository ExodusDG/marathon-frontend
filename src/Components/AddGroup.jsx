import { Link } from 'react-router-dom';
import '../App.css';
import DatePicker from 'react-date-picker';
import { useEffect, useState } from 'react';
import close from '../image/close.svg'
import moment from 'moment'
import axios from 'axios'
var qs = require('qs');

function AddGroup(props) {

    const [value, onChange] = useState(new Date());
    const [date, setDate] = useState(moment().format('MM-D-YY'))
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setDate(moment(Number(value)).format('MM-D-YY'))
        console.log(date)
    }, [value])

    useEffect(() => {

        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_URL + '/getMessagesList',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        axios(config)
            .then(function (response) {
                response = response.data
                setMessages(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [])

    const [name, setName] = useState('')
    const [login, setLogin] = useState('')
    const [selectedShelude, setSelectedShelude] = useState('Select...')

    function addGroup() {
        if (name.length > 0 && login.length > 0 && selectedShelude !== 'Select...' && date.length > 0) {

            var group = qs.stringify({
                groupName: name,
                login: login,
                shelude: selectedShelude,
                startDate: date
            });
            var config = {
                method: 'post',
                url: process.env.REACT_APP_API_URL + '/addGroup',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: group
            };

            axios(config)
                .then(function (response) {
                    if (response.data.status === 200) {
                        props.setGroups(response.data.data)
                        props.setAddGroupPopup(false)
                    } else {
                        alert(response.data.status)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

        } else {
            alert('Please fill all fields!')
        }
    }

    return (
        <div className="userPopup">
            <div className="userPopupBlock">
                <div className="popupClose">
                    <img src={close} alt="Close" onClick={e => props.setAddGroupPopup(false)} />
                </div>
                <p className="userPopupTitle">Add Group</p>

                <input type="text" placeholder='Group Name' value={name} onChange={e => setName(e.target.value)} />
                <input type="text" placeholder='Channel login (@example)' value={login} onChange={e => {
                    if (e.target.value.indexOf('https://t.me/') !== -1) {
                        setLogin(e.target.value.replace('https://t.me/', '@'))
                    } else {
                        setLogin(e.target.value)
                    }
                }} />

                <p className='messagesPopupTitle'>Messages</p>
                <p className='messagesTextPopup'>select from the list below or <Link to={'/addnewmessage'}>create new ones</Link></p>

                <select className='messageSelect' defaultValue={'0'} value={selectedShelude} onChange={e => setSelectedShelude(e.target.value)}>
                    <option value="0">Select...</option>
                    {
                        messages.map(msg => (
                            <option value={msg.message_table}>{msg.message_table}</option>
                        ))
                    }
                </select>

                <p className='messagesPopupTitle'>Start date</p>
                <DatePicker onChange={onChange} value={value} />

                <button onClick={e => addGroup()}>Add group</button>
            </div>
        </div>
    );
}

export default AddGroup;