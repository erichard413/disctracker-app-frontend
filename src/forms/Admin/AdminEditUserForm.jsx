import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../../api";
import validateEmail from "../../helpers/emailValidator";
import { useUser } from "../../hooks/useUserContext";
import SuccessModal from "../../components/modals/SuccessModal";
import "../../stylesheets/EditUser.css";

function AdminEditUserForm({ account }) {
  const [modalState, setModalState] = useState(false);
  const { user } = useUser();
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
      if (account) {
        setFormData({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          password: "",
          password2: "",
          isAdmin: account.isAdmin,
        });
      }
    }
    waitForUserData();
  }, [account]);

  const handleChange = e => {
    const { name, value } = e.target;
    // if (name === "password" && value === "") formData.password2 = "";
    setFormData(data => ({
      ...data,
      [name]: value,
    }));
  };
  const boolToggle = e => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: !formData.isAdmin }));
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
      if (formData.email && !validateEmail(formData.email))
        errs.email = "Email address must be a valid email!";
      setFlashMsg(errs);
      if (Object.keys(errs).length === 0) {
        async function editUser() {
          let data = {};
          if (formData.firstName) data.firstName = formData.firstName;
          if (formData.lastName) data.lastName = formData.lastName;
          if (
            formData.email &&
            formData.email.toLowerCase() != account.email.toLowerCase()
          )
            data.email = formData.email;
          if (formData.password) data.password = formData.password;
          data.isAdmin = formData.isAdmin;
          await DiscTrackerAPI.adminEditUser(account.username, data);
          setModalState(true);
        }
        editUser().catch(err => setFlashMsg({ errors: err }));
      }
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 5000);
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
  console.log(flashMsg);
  return (
    <div className="EditProfileForm">
      <div id="flash-container">
        {flashMsg.success && (
          <p className="FlashMsg-success">{flashMsg.success}</p>
        )}
        {flashMsg.errors &&
          flashMsg.errors.map((err, i) => <p key={i}>{err}</p>)}
      </div>

      {account && (
        <Form className="form">
          <FormGroup>
            <Label for="firstName">First Name:</Label>
            <Input
              name="firstName"
              type="text"
              placeholder={account.firstName}
              value={formData.firstName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="type">Last Name:</Label>
            <Input
              name="lastName"
              type="text"
              placeholder={account.lastName}
              value={formData.lastName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="type">Email:</Label>
            <Input
              name="email"
              type="email"
              placeholder={account.email}
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
      {modalState && (
        <SuccessModal
          setModalState={setModalState}
          modalTitle={"User updated!"}
          formData={formData}
          modalState={modalState}
          modalMessage={`Successfully edited User: ${account.username}`}
          navTo={`/admin/users`}
        />
      )}
    </div>
  );
}

export default AdminEditUserForm;
