import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";
import { useNavigate } from "react-router-dom";
import defaultUserImg from "../assets/user-images/defaultprofilepic.png";
import "../stylesheets/Account.css";
import DiscTrackerAPI from "../api";
import Modal from "./modals/Modal";
import DeleteModal from "./modals/Content/DeleteModal";
import { getPublicIdFromUrl } from "../helpers/cloudinary";

function Account() {
  const { user, setUser } = useUser();
  const [modalState, setModalState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !localStorage.getItem("token")) {
      navigate("/", { replace: true });
      return;
    }
  }, []);

  if (!user) return <></>;

  const dateStrings = user.joinDate.split(" ")[0].split("-");

  const imgUrl = user.imgUrl ? user.imgUrl : defaultUserImg;

  async function profileImgReset() {
    // set imgUrl to null in db:
    const res = await DiscTrackerAPI.resetUserImage(user.username);
    // then delete the image from cloudinary:
    if (user.imgUrl) {
      const id = getPublicIdFromUrl(user.imgUrl);
      await DiscTrackerAPI.deleteStoredImage(id, user.username);
    }
    setUser(res);
    return;
  }

  return (
    <div className="Account">
      <h2>Your Account - {user.username}</h2>
      <div className="top-container">
        <div className="left-container">
          <img id="avatar-pic" src={imgUrl} alt="user-profile-pic" />
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
        <Link to={`/users/${user.username}/avatar`}>
          <button type="button">Upload Profile Picture</button>
        </Link>
        <button
          onClick={() => setModalState(true)}
          disabled={user.imgUrl ? false : true}
        >
          Delete Profile Picture
        </button>
        <Link to={`/myaccount/checkins`}>
          <button type="button">My Check Ins</button>
        </Link>
      </div>
      <Modal setModalState={setModalState} modalState={modalState}>
        <DeleteModal doDelete={profileImgReset}>
          <h4>Delete Profile Picture?</h4>
          <p>
            Are you sure you want to delete your profile photo? This cannot be
            undone.
          </p>
        </DeleteModal>
      </Modal>
    </div>
  );
}

export default Account;
