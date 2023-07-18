import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import DiscTrackerAPI from '../api';
import DiscCheck from './DiscCheck';

function UserCheckIns({user}) {
    const navigate = useNavigate();
    const [checkins, setCheckins] = useState();

    useEffect(()=>{
        if (localStorage.getItem('token') == null) {
            navigate('/home');
            return;
        }
        async function fetchCheckins() {
            const res = await DiscTrackerAPI.getUserCheckins(user.username);
            setCheckins(res);
        }
        fetchCheckins();
    }, []);

    if (!user) return (<div><p>Loading..</p></div>)

    return (
        <div className="UserCheckIns">
            <h3>Check Ins for {user.username}</h3>
            {checkins && checkins.map(checkin => (
                <DiscCheck key={checkin.id} checkin={checkin} />
            ))}
        </div>
    )
}

export default UserCheckIns