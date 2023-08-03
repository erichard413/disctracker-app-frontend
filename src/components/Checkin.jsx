import React, { useState, useEffect } from "react";
import CheckinForm from "../forms/CheckinForm";
import DiscTrackerAPI from "../api";
import { useParams } from "react-router-dom";
import "../stylesheets/Checkin.css";
import RegisterModal from "./modals/RegisterModal";

function Checkin({ user, setUser }) {
  const { discId } = useParams();
  const [disc, setDisc] = useState();
  const [load, setLoad] = useState("load");
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    async function fetchDisc() {
      const result = await DiscTrackerAPI.getDisc(discId);
      setDisc(result);
    }
    fetchDisc();
    setLoad("ready");
    if (!localStorage.getItem("token")) {
      setModalState(true);
    }
  }, []);

  if (load === "ready" && !disc) {
    return (
      <div>
        <p>404 - not found!</p>
      </div>
    );
  }

  const toggleModal = () => {
    setModalState(!modalState);
  };

  let signUpDisabled = user ? true : false;

  return (
    <div className="Checkin">
      {modalState && (
        <RegisterModal
          modalState={modalState}
          setModalState={setModalState}
          setUser={setUser}
        />
      )}
      {disc && <CheckinForm user={user} disc={disc} />}
      <button onClick={toggleModal} disabled={signUpDisabled}>
        SignUp
      </button>
    </div>
  );
}

export default Checkin;
