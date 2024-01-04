import { useRef, useState, useEffect, useLayoutEffect } from "react";
import "../../stylesheets/Admin/Modal.css";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

function SuccessModal({
  setModalState,
  modalState,
  modalMessage,
  modalTitle,
  navTo,
}) {
  console.log(modalState);
  const prevIsOpen = useRef();
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    prevIsOpen.current = modalState;
  }, []);

  useLayoutEffect(() => {
    if (!modalState && prevIsOpen.current) {
      setIsClosing(state => !state);
    }
    prevIsOpen.current = modalState;
  }, [modalState]);

  const handleClose = () => {
    setModalState(false);
  };

  if (!modalState && !isClosing) return null;

  return createPortal(
    <>
      {(modalState || isClosing || prevIsOpen.current) && (
        <div className={`Modal ${isClosing ? "closing" : ""} `}>
          <div
            className="overlay"
            onAnimationEnd={() => {
              if (isClosing) {
                setIsClosing(false);
                navigate(navTo);
              }
            }}
          ></div>
          <div className="modal-body">
            <h4>{modalTitle}</h4>
            {modalMessage && <p>{modalMessage}</p>}
            <div className="Modal-btns">
              <button onClick={handleClose}>Confirm</button>
            </div>
          </div>
        </div>
      )}{" "}
    </>,
    document.body.querySelector("#modal-div")
  );
}

export default SuccessModal;
