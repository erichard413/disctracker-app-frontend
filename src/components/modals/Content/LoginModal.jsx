import React from "react";
import "../../../stylesheets/modals/Content/LoginModal.css";
import LoginForm from "../../../forms/LoginForm";

function LoginModal({ setModalState, modalState, handleClose, doLogin }) {
  return (
    <div className="LoginModal modal-body">
      <h2>Log In</h2>
      <p>
        If you already have a created account, you can log in to track your
        check in history and leave a note for others to see.
      </p>
      <LoginForm
        login={doLogin}
        setModalState={setModalState}
        modalState={modalState}
        handleClose={handleClose}
      />
    </div>
  );
}

export default LoginModal;
