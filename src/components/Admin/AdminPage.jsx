import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AdminPage({user}) {
    const navigate = useNavigate();

    useEffect(()=>{
        if (localStorage.getItem('token') == null) {
          navigate('/home');
          return
          }  
    }, [])

    if (user && !user.isAdmin) {
        navigate('/', {replace: true})
        return;
    }

    return (
        <div className="AdminPage">
            <h3>
                Administration Panel
            </h3>
            <div className="Admin-links">
                <ul>
                    <li>
                        <Link to="/admin/users" user={user}>
                            <button type="button">Manage Users</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/checkins" user={user}>
                            <button type="button">Manage Checkins</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/discs/create" user={user}>
                            <button type="button">Create Disc</button>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AdminPage;