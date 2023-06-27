import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import DiscTrackerAPI from '../../api';

function AllUsers({user, accounts, setAccounts, setAccount}) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
 
    useEffect(()=>{
        if (localStorage.getItem('token') == null) {
          navigate('/home');
          return
        }
    }, []);

    useEffect(()=> {
        const fetchAccounts = async () => {
            const result = await DiscTrackerAPI.getUsers(page);
            setAccounts(result);
        }
        if (user && user.isAdmin) fetchAccounts();
    }, [user, page])

    if (user && !user.isAdmin) {
        navigate('/', {replace: true})
        return;
    }

    const incrementPage = () => {
        if (page < accounts.endPage) setPage(page+1);
    }
    const decrementPage = () => {
        if (page > 1) setPage(page-1);
    }

    const handleClick = (acc) => {
        async function doClick() {
            await setAccount(acc);
            navigate(`/admin/users/${acc.username}`);
        }
        doClick();
    }

    return (
        <div className="AdminUsers">
            <h3>User Management</h3>
            <div className="AdminUsers-users-container">
                    <button onClick={decrementPage}>prev</button>
                        <span>{page}</span>
                    <button onClick={incrementPage}>next</button>
            <ul>
                {accounts && accounts.results.map(acc => (
                    <li key={acc.username} onClick={()=>{handleClick(acc)}}>
                        {acc.username}    
                    </li> 
                ))}
            </ul>
            </div>
        </div>
    )
}

export default AllUsers