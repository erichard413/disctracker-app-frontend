import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { isEmail } from "../helpers/isEmail";
import DiscTrackerAPI from "../api";
import { FlashContainer } from "../components/flash/FlashContainer";

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

    if (name === "password2" && value.length <= 20) {
      value = value.replace(/\s/g, "");
      changeState();
    }
    if (name === "email" && value.length <= 60) {
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

      const res = await DiscTrackerAPI.register(formData);
      console.log(res);

      if (res.status == 400 || res.status == 401) {
        setFlashMsg({ Error: res.data.error.message });
        return;
      }

      await doLogin(formData.username, formData.password);

      if (handleClose) {
        handleClose();
      }
      if (!handleClose) navigate("/home", { replace: true });
    };

    signMeUp();

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
    if (!isEmail(formData.email)) {
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
          <FlashContainer flashMsg={flashMsg} />

          <Label htmlFor="username">Username:</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password:</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password2">Retype Password:</Label>
          <Input
            id="password2"
            name="password2"
            type="password"
            placeholder="Re-Type Password"
            value={formData.password2}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="firstName">First Name:</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="lastName">Last Name:</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <div className="buttons-container">
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
          {handleClose && <button onClick={handleLogInClick}>Log In</button>}
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isComplete() ? false : true}
            data-testid="register-btn"
          >
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default RegisterForm;
