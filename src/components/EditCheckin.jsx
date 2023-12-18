import React, { useEffect, useState } from "react";
import EditCheckinForm from "../forms/EditCheckinForm";
import { useNavigate, useParams } from "react-router-dom";
import DiscTrackerAPI from "../api";
import { useUser } from "../hooks/useUserContext";

function EditCheckin() {
  const [checkin, setCheckin] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/home");
    }
    async function fetchCheckIn() {
      const res = await DiscTrackerAPI.getCheckin(id);
      setCheckin(res);
    }
    fetchCheckIn();
  }, []);

  if (!checkin)
    return (
      <div>
        <p>Loading..</p>
      </div>
    );

  return (
    <div className="EditCheckin">
      <EditCheckinForm checkin={checkin} />
    </div>
  );
}

export default EditCheckin;
