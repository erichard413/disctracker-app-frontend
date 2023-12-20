import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../api";
import DiscCheck from "./DiscCheck";
import { useUser } from "../hooks/useUserContext";
import "../stylesheets/UserCheckIns.css";

function UserCheckIns() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState();

  useEffect(() => {
    async function fetchCheckins() {
      const res = await DiscTrackerAPI.getUserCheckins(user.username);
      setCheckins(res);
    }
    fetchCheckins();
  }, []);

  if (!user) navigate("/");

  return (
    <div className="UserCheckIns">
      <h3>Check Ins for {user.username}</h3>
      <div className="checkins-container">
        {checkins &&
          checkins.map(checkin => (
            <DiscCheck key={checkin.id} checkin={checkin} />
          ))}
      </div>
    </div>
  );
}

export default UserCheckIns;
