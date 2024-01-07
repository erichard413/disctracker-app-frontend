import React, { useState } from "react";
import LoginForm from "../forms/LoginForm";

function Login({ doLogin }) {
  return (
    <div className="Login">
      <LoginForm login={doLogin} />
    </div>
  );
}

export default Login;
