import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DiscTrackerAPI from '../../api';
import { Link } from 'react-router-dom';

function UserPanel({user, account, setAccount}) {
    const navigate = useNavigate();
    const {username} = useParams();
    const [loadState, setLoadState] = useState('load');

    useEffect(()=>{
        if (localStorage.getItem('token') == null) {
          navigate('/home');
          return
        }
    }, []);

    useEffect(()=>{
        setLoadState('done');
    }, [user])

    useEffect(()=> {
        if (loadState=== 'done' && !account) {
        console.log('no account - fetch data')
        async function fetchAccount() {
            const res = await DiscTrackerAPI.getUser(username);
            setAccount(res);
        }
            fetchAccount();
        }
    }, [loadState])

    if (loadState === 'load') {
        return (
            <p>Loading..</p>
        )
    }

    if (user && !user.isAdmin) {
        navigate('/', {replace: true})
        return;
    }

    if (!account) {
        return (
            <p>Loading..</p>
        )
    }

    const dateStrings = account.joinDate.split(" ")[0].split("-");

    return (
        <div className="UserPanel">
            <h3>{username}</h3>
            <ul>
                <li>First Name: {account.firstName}</li>
                <li>Last Name: {account.lastName}</li>
                <li>Email: {account.email}</li>
                <li>Joined: {dateStrings[1] + "-" + dateStrings[2] + "-" + dateStrings[0]}</li>
            </ul>
            <Link to={`/admin/users/edit/${username}`}>
                    <button type="button">Edit Profile</button>
            </Link>
        </div>
    )
}

export default UserPanel