import React, {useState} from 'react';
import LoginForm from '../forms/LoginForm';

function Login({login}) {
    return(
        <div className="Login">
            <LoginForm login={login} />
        </div>
    )
}

export default Login