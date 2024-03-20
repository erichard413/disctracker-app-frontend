import React, { useState, useEffect } from "react";
import CheckinForm from "../forms/CheckinForm";
import { useUser } from "../hooks/useUserContext";
import { useDiscs } from "../hooks/useDiscContext";
import { useParams } from "react-router-dom";
import "../stylesheets/Checkin.css";
import RegisterModal from "./modals/Content/RegisterModal";
import { SuccessModal } from "./modals/Content/SuccessModal";
import LoginModal from "./modals/Content/LoginModal";
import Modal from "./modals/Modal";
import { useNavigate } from "react-router-dom";
import { Disc404 } from "./404/Disc404";
import { isMobile } from "react-device-detect";

function Checkin({ doLogin }) {
  const { discs } = useDiscs();
  const { discId } = useParams();
  const [load, setLoad] = useState("load");
  const [registerModalState, setRegisterModalState] = useState(false);
  const [loginModalState, setLoginModalState] = useState(false);
  const [redirectModal, setRedirectModal] = useState(false);
  const [error, setError] = useState();

  const disc = discs ? discs.filter(d => d.id == discId)[0] : null;

  useEffect(() => {
    if (
      !isMobile &&
      import.meta.env.MODE !== "development" &&
      import.meta.env.MODE !== "test"
    ) {
      setRedirectModal(true);
      return;
    }

    if (!localStorage.getItem("token")) {
      setRegisterModalState(true);
    }
  }, []);

  if (load === "error" && !disc) {
    return <Disc404 error={error} />;
  }

  return (
    <div className="Checkin">
      <div className="text-content">
        <h2>Check in Disc</h2>
        <p>
          Fill out the form below as completely as possible. You may find your
          course while typing the course name, click on desired course to
          auto-fill this form.
        </p>
      </div>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <Modal
        modalState={registerModalState}
        setModalState={setRegisterModalState}
        navTo={`/checkin/${discId}`}
      >
        <RegisterModal doLogin={doLogin} setLoginModal={setLoginModalState} />
      </Modal>
      <Modal
        modalState={loginModalState}
        setModalState={setLoginModalState}
        navTo={`/checkin/${discId}`}
      >
        <LoginModal doLogin={doLogin} />
      </Modal>
      <Modal
        modalState={redirectModal}
        setModalState={setRedirectModal}
        navTo={"/"}
      >
        <SuccessModal
          modalMessage={
            "The page you are trying to access is not available on desktop. Please use a mobile device to make a check in."
          }
          modalTitle={"Checkins Not Available On Device"}
        />
      </Modal>

      {disc && (
        <CheckinForm
          disc={disc}
          openRegisterModal={() => setRegisterModalState(true)}
          openLogInModal={() => setLoginModalState(true)}
        />
      )}
    </div>
  );
}

export default Checkin;
