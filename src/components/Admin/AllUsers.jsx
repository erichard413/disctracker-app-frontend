import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import DiscTrackerAPI from '../../api';
import DeleteUserModal from './modals/DeleteUserModal';

function AllUsers({user, accounts, setAccounts, setAccount}) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [modalState, setModalState] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [flashMsg, setFlashMsg] = useState();

    useEffect(()=>{
        if (localStorage.getItem('token') == null) {
          navigate('/home');
          return
        }
    }, []);

    useEffect(()=> {
        const fetchAccounts = async () => {
            const result = await DiscTrackerAPI.getUsers(page);
            const userList = result.results.filter(acc => acc.username.toLowerCase() !== user.username.toLowerCase() && acc.isAdmin === false);
            setAccounts({...result, results: userList});
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

    const handleDeleteClick = (e) => {
        e.preventDefault();
        setModalState(!modalState);
        setSelectedUser(e.target.closest('li').innerText.slice(0, -2));
    }

    const doDelete = async() => {
        const res = await DiscTrackerAPI.adminDeleteUser(selectedUser);
        setModalState(!modalState);
        let updateAccList = (accounts.results.filter(acc => acc.username.toLowerCase() !== selectedUser.toLowerCase() && acc.isAdmin === false ));
        setAccounts({...accounts, results: updateAccList});
        setFlashMsg(res);
        setTimeout(()=>{setFlashMsg()}, 3000);
    }


    return (
        <div className="AdminUsers">
            <h3>User Management</h3>
            <p>{flashMsg}</p>
            <div className="AdminUsers-users-container">
                    <button onClick={decrementPage}>prev</button>
                        <span>{page}</span>
                    <button onClick={incrementPage}>next</button>
            <ul>
                {accounts && accounts.results.map(acc => (
                    
                    <li key={acc.username} >
                        <span onClick={()=>{handleClick(acc)}}>{acc.username}</span> <button className="user-delete-btn" onClick={handleDeleteClick}>X</button>   
                    </li> 
 
                ))}
                {modalState && <DeleteUserModal username={selectedUser} setModalState={setModalState} doDelete={doDelete} /> }
            </ul>
            </div>
        </div>
    )
}

export default AllUsers