import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCreateDiscForm from '../../forms/Admin/AdminCreateDiscForm';

function CreateDisc({user}) {
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
            <h3>Create disc</h3>
            <AdminCreateDiscForm user={user} />
        </div>
    )
}

export default CreateDisc;