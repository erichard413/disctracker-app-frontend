import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../api";

function RegisterForm({ handleClose = null, doLogin, setLoginModal = null }) {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const initialState = {
    username: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    email: "",
  };
  const [flashMsg, setFlashMsg] = useState();
  const [formData, setFormData] = useState(initialState);
  let validTopDomains = [".com", ".edu", ".org", ".net"];

  const handleChange = e => {
    let { name, value } = e.target;

    const changeState = () => {
      setFormData(data => ({
        ...data,
        [name]: value,
      }));
    };
    if (name === "username" && value.length <= 30) {
      value = value.replace(/\s/g, "");
      changeState();
    }
    if (name === "password" && value.length <= 20) {
      value = value.replace(/\s/g, "");
      changeState();
    }
    if (name === "firstName" && value.length <= 30) changeState();
    if (name === "lastName" && value.length <= 30) changeState();
    if (name === "email" && value.length <= 60) changeState();
    if (name === "password2" && value.length <= 20) {
      value = value.replace(/\s/g, "");
      changeState();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const signMeUp = async () => {
      if (formData.password !== formData.password2) {
        setFlashMsg({ Error: "Passwords must match!" });
        return;
      }
      if (!validTopDomains.includes("." + formData.email.split(".")[1])) {
        setFlashMsg({ ...flashMsg, Error: "Email must be a valid email!" });
        return;
      }
      await DiscTrackerAPI.register(formData);
      await doLogin(formData.username, formData.password);

      if (handleClose) {
        handleClose();
      }
      if (!handleClose) navigate("/home", { replace: true });
    };
    signMeUp().catch(err => setFlashMsg({ Error: err }));
    setTimeout(() => {
      setFlashMsg("");
    }, 5000);
  };

  // returns false if form not complete, true when form is completed
  const isComplete = () => {
    let res;
    // if any fields empty, return false
    Object.values(formData).map(data => (data === "" ? (res = false) : null));
    if (res === false) {
      return false;
    }
    // does data fit length requirements?
    if (formData.username.length < 2 || formData.username.length > 30) {
      return false;
    }
    if (formData.password.length < 5 || formData.password.length > 20) {
      return false;
    }
    if (formData.firstName.length < 2 || formData.firstName.length > 30) {
      return false;
    }
    if (formData.lastName.length < 2 || formData.lastName.length > 30) {
      return false;
    }
    // is email?
    if (
      !formData.email.includes("@") ||
      !formData.email.includes(".") ||
      formData.email.length < 6
    ) {
      return false;
    }
    return true;
  };

  //handle log in, should close register modal, open log in modal.
  const handleLogInClick = e => {
    e.preventDefault();
    handleClose();
    setLoginModal(true);
  };

  return (
    <div className="RegisterForm">
      <Form className="form">
        <FormGroup>
          <div id="flash-container">
            {/* {flashMsg && <p>{flashMsg.Error[0] || flashMsg.Error}</p>} */}
          </div>

          <Label for="type">Username:</Label>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">Password:</Label>
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">Retype Password:</Label>
          <Input
            name="password2"
            type="password"
            placeholder="Re-Type Password"
            value={formData.password2}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">First Name:</Label>
          <Input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">Last Name:</Label>
          <Input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">Email:</Label>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <div className="buttons-container">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isComplete() ? false : true}
          >
            Sign Up
          </Button>
          {handleClose && <button onClick={handleLogInClick}>Log In</button>}
          {handleClose && (
            <button
              onClick={e => {
                e.preventDefault();
                handleClose();
              }}
            >
              Skip
            </button>
          )}
        </div>
      </Form>
    </div>
  );
}

export default RegisterForm;
