import React from "react";
import "../../../stylesheets/modals/Content/RegisterModal.css";
import RegisterForm from "../../../forms/RegisterForm";

function RegisterModal({
  setModalState,
  modalState,
  handleClose,
  doLogin,
  setLoginModal,
}) {
  return (
    <div className="RegisterModal modal-body">
      <h2>Welcome to the Traveling Disc Project.</h2>
      <h4>Create Account?</h4>
      <p>
        Creating an account will allow you to attach a note to your check in,
        and will let you follow your previously checked in discs.
      </p>
      <RegisterForm
        doLogin={doLogin}
        setModalState={setModalState}
        modalState={modalState}
        handleClose={handleClose}
        setLoginModal={setLoginModal}
      />
    </div>
  );
}

export default RegisterModal;
