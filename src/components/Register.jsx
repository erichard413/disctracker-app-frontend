import React from "react";
import RegisterForm from "../forms/RegisterForm";
import "../stylesheets/Register.css";

function Register({ doLogin }) {
  return (
    <div className="Register">
      <h2>Create Account</h2>
      <RegisterForm doLogin={doLogin} />
    </div>
  );
}

export default Register;
