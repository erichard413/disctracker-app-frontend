import React, { useState } from "react";
import { FlashContainer } from "../components/flash/FlashContainer";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function LoginForm({ login, handleClose = null }) {
  const navigate = useNavigate();
  const initialFlash = "";
  const initialState = { username: "", password: "" };
  const [flashMsg, setFlashMsg] = useState(initialFlash);
  const [formData, setFormData] = useState(initialState);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(data => ({
      ...data,
      [name]: value,
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await login(formData.username, formData.password);
    console.log(res);
    if (!res.token) {
      setFlashMsg({ message: res });
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 3000);
    }
    if (handleClose) {
      handleClose();
      return;
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="Login">
      <FlashContainer flashMsg={flashMsg} />
      <Form className="form">
        <FormGroup>
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

        <Button type="submit" onClick={handleSubmit}>
          Login
        </Button>
        {handleClose && (
          <button
            onClick={e => {
              e.preventDefault();
              handleClose();
            }}
          >
            Cancel
          </button>
        )}
      </Form>
      <Link to="/resetpw">
        <p>Forgot Password?</p>
      </Link>
    </div>
  );
}

export default LoginForm;
