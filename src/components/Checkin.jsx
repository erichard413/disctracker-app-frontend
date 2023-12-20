import React, { useState, useEffect } from "react";
import CheckinForm from "../forms/CheckinForm";
import { useUser } from "../hooks/useUserContext";
import DiscTrackerAPI from "../api";
import { useParams } from "react-router-dom";
import "../stylesheets/Checkin.css";
import RegisterModal from "./modals/RegisterModal";

function Checkin() {
  const { discId } = useParams();
  const { user, setUser } = useUser();
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
        <RegisterModal modalState={modalState} setModalState={setModalState} />
      )}
      {disc && <CheckinForm disc={disc} />}
      {!user && <button onClick={toggleModal}>SignUp</button>}
    </div>
  );
}

export default Checkin;
