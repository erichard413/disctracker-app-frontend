import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCreateUserForm from '../../forms/Admin/AdminCreateUserForm';


function CreateUser({user}) {
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
        <div className="CreateDisc">
            <h3>Create User</h3>
            <AdminCreateUserForm user={user}/>
        </div>
    )
}

export default CreateUser;