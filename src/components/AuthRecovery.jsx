import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../api";
import { FlashContainer } from "./flash/FlashContainer";
import Modal from "./modals/Modal";
import { SuccessModal } from "./modals/Content/SuccessModal";

function AuthRecovery() {
  const initialState = { username: "" };
  const initialFlash = {};
  const [formData, setFormData] = useState(initialState);
  const [flashMsg, setFlashMsg] = useState(initialFlash);
  const [modalState, setModalState] = useState(false);
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(data => ({
      ...data,
      [name]: value,
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    const resetPassword = async () => {
      try {
        await DiscTrackerAPI.resetPassword(formData.username);
        setModalState(true);
      } catch (err) {
        setFlashMsg({ Error: err });
      }
    };
    resetPassword();
  };
  return (
    <div className="AuthRecovery">
      <h3>Reset your Password</h3>
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
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={formData.username == ""}
        >
          Reset
        </Button>
      </Form>
      <Modal
        modalState={modalState}
        setModalState={setModalState}
        navTo={`/home`}
      >
        <SuccessModal
          modalTitle={"Account Recovery"}
          modalMessage={`Thank you - If an account with username ${formData.username} exists you will receive a temporary password to your email.`}
        />
      </Modal>
    </div>
  );
}

export default AuthRecovery;
