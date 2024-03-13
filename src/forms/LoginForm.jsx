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
    if (!res.token) {
      setFlashMsg({ Error: res });
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 3000);
      return;
    }
    if (handleClose && res.token) {
      handleClose();
      return;
    }
    if (!handleClose && res.token) {
      navigate("/home");
    }
  };

  return (
    <div className="Login">
      <FlashContainer flashMsg={flashMsg} />
      <Form className="form">
        <FormGroup>
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
    </div>
  );
}

export default LoginForm;
