import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DiscTrackerAPI from "../../api";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUserContext";
import defaultUserImg from "../../assets/user-images/defaultprofilepic.png";

function UserPanel({ account, setAccount }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { username } = useParams();
  const [loadState, setLoadState] = useState("load");
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/", { replace: true });
      return;
    }
  }, []);

  useEffect(() => {
    setLoadState("done");
  }, [user]);

  useEffect(() => {
    if (loadState === "done" && !account) {
      console.log("no account - fetch data");
      async function fetchAccount() {
        const res = await DiscTrackerAPI.getUser(username);
        setAccount(res);
      }
      fetchAccount();
    }
  }, [loadState]);

  if (loadState === "load") {
    return <p>Loading..</p>;
  }

  if (user && !user.isAdmin) {
    navigate("/", { replace: true });
    return;
  }

  if (!account) {
    return <p>Loading..</p>;
  }

  const dateStrings = account.joinDate.split(" ")[0].split("-");

  return (
    <div className="Account">
      <h2>{account.username}</h2>
      <div className="top-container">
        <div className="left-container">
          <img src={defaultUserImg} alt="default-profile-pic" />
        </div>
        <div className="right-container">
          <ul>
            <li>First Name: {account.firstName}</li>
            <li>Last Name: {account.lastName}</li>
            <li>Email: {account.email}</li>
            <li>
              Joined:{" "}
              {dateStrings[1] + "-" + dateStrings[2] + "-" + dateStrings[0]}
            </li>
          </ul>
          <Link to={`/admin/users/edit/${username}`}>
            <button type="button">Edit Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;
