import '../App.css';
import axios from 'axios'
import AddGroup from '../Components/AddGroup';
import EditGroup from '../Components/EditGroup';
import { useEffect, useState } from 'react';
var qs = require('qs');

function Groups() {

    const [addGroupPopup, setAddGroupPopup] = useState(false)
    const [groups, setGroups] = useState([])

    const [editGroupPopup, setEditGroupPopup] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState([])

    useEffect(() => {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_URL + '/getGroups',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        axios(config)
            .then(function (response) {
                response = response.data[0]
                setGroups(response);
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
            url: process.env.REACT_APP_API_URL + '/deleteGroup',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: msg
        };

        axios(config)
            .then(function (response) {
                setGroups(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className='pageWrapper'>

            <div className="pageHeader">
                <h1>Groups</h1>
                <button onClick={e => setAddGroupPopup(true)}>Add group</button>
            </div>

            <div className="groupsTable">
                {
                    groups.map((group) => (
                        <div className='groupItem'>
                            <p className='groupName'>{group.group_name}</p>
                            <p><span>Status:</span> {(group.active_group === 1) ? <span className='activeStatus'>Active</span> : <span className='inActiveStatus'>Inactive</span>}</p>
                            <p><span>Current Day:</span> {group.current_day}</p>
                            <p><span>Messages Preset: </span>{group.shelude}</p>

                            <div className="groupItemButtons">
                                <button onClick={e => {
                                    setSelectedGroup(group);
                                    setEditGroupPopup(true)
                                }}>Edit</button>
                                <button onClick={e => deleteItem(group.group_name)}>Delete</button>
                            </div>
                        </div>
                    ))
                }


            </div>

            {
                (editGroupPopup === true) ? <EditGroup setGroups={setGroups} setEditGroupPopup={setEditGroupPopup} data={selectedGroup} /> : ''
            }

            {
                (addGroupPopup === true) ? <AddGroup setGroups={setGroups} setAddGroupPopup={setAddGroupPopup} /> : ''
            }
        </div>

    );
}

export default Groups;
