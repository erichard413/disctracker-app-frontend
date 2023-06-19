import React, {useState} from 'react';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
  } from 'reactstrap';
import DiscTrackerAPI from '../api';

function AuthRecovery() {
    const initialState = {username: ""}
    const initialFlash = {}
    const [formData, setFormData] = useState(initialState);
    const [flashMsg, setFlashMsg] = useState(initialFlash);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const resetPassword = async () => {
            await DiscTrackerAPI.resetPassword(formData.username);
            setFlashMsg({...flashMsg, success: `Thank you - If an account with username ${formData.username} exists you will receive a temporary password to your email.` })
        }
        resetPassword();
    }
    return (
        <div className="AuthRecovery">
            <h3>Reset your Password</h3>
            {flashMsg && <p>{flashMsg.success}</p>}
            
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
                <Button type="submit" onClick={handleSubmit}>Reset</Button>
            </Form>
        </div>
    )
}

export default AuthRecovery