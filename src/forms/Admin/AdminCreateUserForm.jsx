import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../../api";
import SuccessModal from "../../components/modals/SuccessModal";
import { useUser } from "../../hooks/useUserContext";
import "../../stylesheets/Admin/CreateUser.css";

function AdminCreateUserForm() {
  const { user } = useUser();
  let validTopDomains = [".com", ".edu", ".org", ".net"];
  let initialFlash = {};
  let initialForm = {
    username: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    email: "",
    isAdmin: false,
  };

  const [flashMsg, setFlashMsg] = useState(initialFlash);
  const [formData, setFormData] = useState(initialForm);
  const [modalState, setModalState] = useState(false);

  const handleChange = e => {
    let { name, value } = e.target;

    const changeState = () => {
      setFormData(data => ({
        ...data,
        [name]: value,
      }));
    };
    if (name === "username" && value.length <= 30 && value !== " ") {
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
    if (name === "isAdmin") changeState();
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
      !formData.email.includes("@" || !formData.email.includes(".")) ||
      formData.email.length < 6
    ) {
      return false;
    }
    return true;
  };

  if (!user) {
    return (
      <div>
        <p>Loading..</p>
      </div>
    );
  }

  const boolToggle = e => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: !formData.isAdmin }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    let isErr = false;

    // error handling:
    const handleErrors = async () => {
      if (formData.password !== formData.password2) {
        setFlashMsg({ ...flashMsg, passwordMatch: "Passwords must match!" });
        isErr = true;
      }
      if (!validTopDomains.includes("." + formData.email.split(".")[1])) {
        setFlashMsg({
          ...flashMsg,
          emailNotValid: "Email must be a valid email!",
        });
        isErr = true;
      }
    };
    handleErrors();

    const doCreate = async () => {
      await DiscTrackerAPI.adminCreateNewUser(formData);
      setModalState(true);
    };
    if (!isErr) {
      doCreate().catch(err => setFlashMsg({ errors: err }));
      setTimeout(() => {
        setFlashMsg("");
      }, 5000);

      // if (!result.token) {
      //   setFlashMsg({ ...flashMsg, errors: result });
      // }
      // if (result.token) {
      //   setModalState(true);
      // }
    }

    setTimeout(() => {
      setFlashMsg(initialFlash);
    }, 5000);
  }
  console.log(flashMsg);
  return (
    <div className="AdminCreateUserForm">
      <div id="flash-container">
        {flashMsg.errors &&
          flashMsg.errors.map(err => (
            <p className="FlashMsg-error" key={err}>
              {err}
            </p>
          ))}
      </div>

      {user && (
        <Form className="form">
          <FormGroup>
            <Label for="username">Username:</Label>
            <Input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="firstName">First Name:</Label>
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
            {flashMsg.emailNotValid && (
              <p className="FlashMsg-error">{flashMsg.emailNotValid}</p>
            )}
            <Label for="type">Email:</Label>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            {flashMsg.passwordMatch && (
              <p className="FlashMsg-error">{flashMsg.passwordMatch}</p>
            )}
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
            <Label for="type">Re-Type Password:</Label>
            <Input
              name="password2"
              type="password"
              placeholder="Re-Type Password"
              value={formData.password2}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="type" id="isAdmin-label">
              Is Admin?
            </Label>
            <Input
              name="isAdmin"
              id="isAdmin"
              type="checkbox"
              value={formData.isAdmin}
              onChange={boolToggle}
            />
          </FormGroup>

          <Button
            id="submit-btn"
            type="submit"
            onClick={handleSubmit}
            disabled={!isComplete()}
          >
            Submit
          </Button>

          <SuccessModal
            setModalState={setModalState}
            modalTitle={"User created!"}
            formData={formData}
            modalState={modalState}
            modalMessage={`Successfully created User: ${formData.username}`}
            navTo={`/admin/users`}
          />
        </Form>
      )}
    </div>
  );
}

export default AdminCreateUserForm;
