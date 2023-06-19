import React, {useState} from 'react';
import LoginForm from '../forms/LoginForm';
import { Link } from 'react-router-dom';

function Login({login}) {
    return(
        <div className="Login">
            <LoginForm login={login} />
            <Link to="/resetpw">
                <p>Forgot Password?</p>
            </Link>
        </div>
    )
}

export default Login