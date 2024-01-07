import React, { useState, useEffect } from "react";
import CheckinForm from "../forms/CheckinForm";
import { useUser } from "../hooks/useUserContext";
import DiscTrackerAPI from "../api";
import { useParams } from "react-router-dom";
import "../stylesheets/Checkin.css";
import RegisterModal from "./modals/Content/RegisterModal";
import LoginModal from "./modals/Content/LoginModal";
import Modal from "./modals/Modal";

function Checkin({ doLogin }) {
  const { discId } = useParams();
  const { user, setUser } = useUser();
  const [disc, setDisc] = useState();
  const [load, setLoad] = useState("load");
  const [registerModalState, setRegisterModalState] = useState(false);
  const [loginModalState, setLoginModalState] = useState(false);

  useEffect(() => {
    async function fetchDisc() {
      const result = await DiscTrackerAPI.getDisc(discId);
      setDisc(result);
    }
    fetchDisc();
    setLoad("ready");
    if (!localStorage.getItem("token")) {
      setRegisterModalState(true);
    }
  }, []);

  if (load === "ready" && !disc) {
    return (
      <div>
        <p>404 - not found!</p>
      </div>
    );
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
