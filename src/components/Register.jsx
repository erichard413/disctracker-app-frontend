import React from "react";
import RegisterForm from "../forms/RegisterForm";
import "../stylesheets/Register.css";

function Register() {
  return (
    <div className="Register">
      <h2>Create Account</h2>
      <RegisterForm />
    </div>
  );
}

export default Register;
