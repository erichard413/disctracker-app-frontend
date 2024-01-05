import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import "../../stylesheets/Admin/Modal.css";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

function Modal({
  setModalState,
  modalState,
  modalMessage,
  modalTitle,
  navTo = null,
  children,
}) {
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
                if (navTo) navigate(navTo);
              }
            }}
          ></div>
          {Children.map(children, child => {
            if (!isValidElement(child)) return null;
            return cloneElement(child, {
              ...child.props,
              handleClose: handleClose,
            });
          })}
        </div>
      )}
    </>,
    document.body.querySelector("#modal-div")
  );
}

export default Modal;
