import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";
import { useNavigate } from "react-router-dom";
import defaultUserImg from "../assets/user-images/defaultprofilepic.png";
import "../stylesheets/Account.css";

function Account() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
  }, []);

  if (!user) return <></>;

  const dateStrings = user.joinDate.split(" ")[0].split("-");

  return (
    <div className="Account">
      <h2>Your Account - {user.username}</h2>
      <div className="top-container">
        <div className="left-container">
          <img src={defaultUserImg} alt="default-profile-pic" />
        </div>
        <div className="right-container">
          <ul>
            <li>First Name: {user.firstName}</li>
            <li>Last Name: {user.lastName}</li>
            <li>Email: {user.email}</li>
            <li>
              Joined:{" "}
              {dateStrings[1] + "-" + dateStrings[2] + "-" + dateStrings[0]}
            </li>
          </ul>
        </div>
      </div>

      <div className="Account-content">
        <Link to="/editprofile">
          <button type="button">Edit Profile</button>
        </Link>
        <Link to={`/myaccount/checkins`}>
          <button type="button">My Check Ins</button>
        </Link>
      </div>
    </div>
  );
}

export default Account;
