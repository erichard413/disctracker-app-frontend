import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../api";
import validateEmail from "../helpers/emailValidator";
import { useUser } from "../hooks/useUserContext";

function EditProfileForm() {
  const { user, setUser } = useUser();
  let errs = {};
  let initialFlash = {};
  let initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  };
  const [flashMsg, setFlashMsg] = useState(initialFlash);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    async function waitForUserData() {
      if (user) {
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: "",
          password2: "",
        });
      }
    }
    waitForUserData();
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "password" && value === "") formData.password2 = "";
    setFormData(data => ({
      ...data,
      [name]: value,
    }));
  };

  if (!user) {
    return (
      <div>
        <p>Loading..</p>
      </div>
    );
  }

  const handleSubmit = e => {
    e.preventDefault();
    // check password 1 to password 2
    if (formData.password !== formData.password2) {
      setFlashMsg({ ...flashMsg, passwordErr: "Password fields must match!" });
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 3500);
      return;
    }
    const editProfile = async () => {
      if (formData.firstName === "")
        errs.firstName = "First Name must not be empty!";
      if (formData.lastName === "")
        errs.lastName = "Last Name must not be empty!";
      if (!validateEmail(formData.email))
        errs.email = "Email address must be a valid email!";
      setFlashMsg(errs);
      if (Object.keys(errs).length === 0) {
        async function editUser() {
          let data = {};
          if (formData.firstName) data.firstName = formData.firstName;
          if (formData.lastName) data.lastName = formData.lastName;
          if (formData.email) data.email = formData.email;
          if (formData.password) data.password = formData.password;
          await DiscTrackerAPI.editUser(user.username, data);
          let userData = await DiscTrackerAPI.getUser(user.username);
          setUser(userData);
        }
        editUser();
        setFlashMsg({ ...flashMsg, success: "Profile Updated Successfully!" });
      }
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 3500);
    };
    editProfile();
  };

  // returns false if form not complete, true when form is completed
  const isComplete = () => {
    if (
      !formData.firstName &&
      !formData.lastName &&
      !formData.email &&
      !formData.password
    ) {
      return false;
    }
    // does data fit length requirements?
    if (
      formData.password &&
      (formData.password.length < 5 || formData.password.length > 20)
    ) {
      return false;
    }
    if (
      formData.password2 &&
      (formData.password2.length < 5 || formData.password2.length > 20)
    ) {
      return false;
    }
    if (
      formData.firstName &&
      (formData.firstName.length < 2 || formData.firstName.length > 30)
    ) {
      return false;
    }
    if (
      formData.lastName &&
      (formData.lastName.length < 2 || formData.lastName.length > 30)
    ) {
      return false;
    }
    // is email?
    if (formData.email) {
      if (
        !formData.email.includes("@") ||
        !formData.email.includes(".") ||
        formData.email.length < 6
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="EditProfileForm">
      {flashMsg.success && (
        <p className="FlashMsg-success">{flashMsg.success}</p>
      )}
      {user && (
        <Form className="form">
          <FormGroup>
            <Label for="type">First Name:</Label>
            <Input
              name="firstName"
              type="text"
              placeholder={user.firstName}
              value={formData.firstName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="type">Last Name:</Label>
            <Input
              name="lastName"
              type="text"
              placeholder={user.lastName}
              value={formData.lastName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="type">Email:</Label>
            <Input
              name="email"
              type="email"
              placeholder={user.email}
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            {flashMsg.passwordErr && (
              <p className="FlashMsg-error">{flashMsg.passwordErr}</p>
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
          {formData.password && (
            <FormGroup>
              <Label for="type">Re-Type Password:</Label>
              <Input
                name="password2"
                type="password"
                placeholder="Password"
                value={formData.password2}
                onChange={handleChange}
              />
            </FormGroup>
          )}
          {isComplete() ? (
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          ) : (
            <Button type="submit" disabled onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Form>
      )}
    </div>
  );
}

export default EditProfileForm;
