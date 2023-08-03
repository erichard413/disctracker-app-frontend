import React from "react";
import "../../stylesheets/modals/RegisterModal.css";
import RegisterForm from "../../forms/RegisterForm";

function SuccessModal({ setModalState, modalState, setUser }) {
  const handleClose = () => {
    const rootDiv = document.getElementById("root");
    if (modalState) {
      rootDiv.classList.remove("RegisterModal-noScroll");
    } else {
      rootDiv.classList.add("RegisterModal-noScroll");
    }
    setModalState(false);
  };

  return (
    <div className="RegisterModal-Overlay">
      <div className="RegisterModal">
        <h2>Welcome to the Traveling Disc Project.</h2>
        <h4>Create Account?</h4>
        <p>
          Creating an account will allow you to attach a note to your check in,
          and will let you follow your previously checked in discs.
        </p>
        <RegisterForm
          setUser={setUser}
          setModalState={setModalState}
          modalState={modalState}
        />
        <div className="RegisterModal-btns">
          <button onClick={handleClose}>Skip</button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
