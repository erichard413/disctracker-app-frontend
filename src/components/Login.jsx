import React, { useState } from "react";
import LoginForm from "../forms/LoginForm";
import { Link } from "react-router-dom";

function Login({ doLogin }) {
  return (
    <div className="Login">
      <h2>Log In</h2>
      <p>
        If you have not yet created an account{" "}
        <Link to="/register">sign up here</Link>.
      </p>
      <LoginForm login={doLogin} />
      <p>
        <Link to="/resetpw">Forgot Password?</Link>
      </p>
    </div>
  );
}

export default Login;
