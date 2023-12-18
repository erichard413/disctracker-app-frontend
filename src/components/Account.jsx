import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";

function Account() {
  const { user } = useUser();
  if (!user) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const dateStrings = user.joinDate.split(" ")[0].split("-");

  return (
    <div className="Account">
      <h3>Your Account - {user.username}</h3>
      <ul>
        <li>First Name: {user.firstName}</li>
        <li>Last Name: {user.lastName}</li>
        <li>Email: {user.email}</li>
        <li>
          Joined: {dateStrings[1] + "-" + dateStrings[2] + "-" + dateStrings[0]}
        </li>
      </ul>
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
