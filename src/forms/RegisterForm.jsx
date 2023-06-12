import React, {useState} from 'react';
import jwt_decode from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
  } from 'reactstrap';
import DiscTrackerAPI from '../api';

  function RegisterForm({setUser}) {
    const navigate = useNavigate();
    const initialState = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    }
    const [formError, setFormError] =  useState([]);
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const signMeUp = async()=>{
                const res = await DiscTrackerAPI.register(formData);
                DiscTrackerAPI.token = res.token;
                setFormData(initialState);
                let data = jwt_decode(DiscTrackerAPI.token);
                let userData = await DiscTrackerAPI.getUser(data.username);
                setUser(userData);
                navigate('/home', {replace: true});
            }
            signMeUp().catch(err=> setFormError({Error: err}))
        }
    

    // returns false if form not complete, true when form is completed
    const isComplete = () => {
        let res;
        // if any fields empty, return false
        Object.values(formData).map(data => data === "" ? res = false : null);
        if (res === false) {
            return false;
        }
        // does data fit length requirements?
        if (formData.username.length < 2 || formData.username.length > 30)  {
            return false;
        }
        if (formData.password.length < 5 || formData.password.length > 20)  {
            return false;
        }
        if (formData.firstName.length < 2 || formData.firstName.length > 30) {
            return false;
        }
        if (formData.lastName.length < 2 || formData.lastName.length > 30) {
            return false;
        }
        // is email?
        if (!formData.email.includes('@' || !formData.email.includes('.')) || formData.email.length < 6) {
            return false;
        }
        return true;
    }

    return (
        <div className="RegisterForm">
        <Form className="form">
          <FormGroup>
            {formError && <p className="FlashMsg">{formError.Error}</p>}
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
            <Input name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="type">First Name:</Label>
            <Input name="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="type">Last Name:</Label>
            <Input name="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="type">Email:</Label>
            <Input name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
          </FormGroup>
        {isComplete() ? <Button type="submit" onClick={handleSubmit}>Sign Up</Button> : <Button type="submit" onClick={handleSubmit} disabled>Sign Up</Button> }
        </Form>
        </div>        
    )
  }

  export default RegisterForm