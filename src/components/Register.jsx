import React from 'react';
import RegisterForm from '../forms/RegisterForm';

function Register({setUser}) {
    return (
        <div>
            <RegisterForm setUser={setUser} />
        </div>
    )
}

export default Register