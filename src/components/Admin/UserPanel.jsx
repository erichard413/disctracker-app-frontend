import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DiscTrackerAPI from "../../api";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUserContext";
import defaultUserImg from "../../assets/user-images/defaultprofilepic.png";
import Modal from "../modals/Modal";
import DeleteModal from "../modals/Content/DeleteModal";
import { getPublicIdFromUrl } from "../../helpers/cloudinary";

function UserPanel({ account, setAccount }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { username } = useParams();
  const [loadState, setLoadState] = useState("load");
  const [modalState, setModalState] = useState(false);
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

  async function profileImgReset() {
    // set imgUrl to null in db:
    const res = await DiscTrackerAPI.resetUserImage(account.username);
    // then delete the image from cloudinary:
    if (account.imgUrl) {
      const id = getPublicIdFromUrl(account.imgUrl);
      await DiscTrackerAPI.deleteStoredImage(id, account.username);
    }
    setAccount(res);
    return;
  }

  const imgUrl = account.imgUrl ? account.imgUrl : defaultUserImg;

  const dateStrings = account.joinDate.split(" ")[0].split("-");

  return (
    <div className="Account">
      <h2>{account.username}</h2>
      <div className="top-container">
        <div className="left-container">
          <img id="avatar-pic" src={imgUrl} alt="user-profile-pic" />
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
        </div>
      </div>
      <div className="Account-content">
        <Link to={`/admin/users/edit/${username}`}>
          <button type="button">Edit Profile</button>
        </Link>
        <button
          onClick={() => setModalState(true)}
          disabled={account.imgUrl ? false : true}
        >
          Delete Profile Picture
        </button>
      </div>
      <Modal setModalState={setModalState} modalState={modalState}>
        <DeleteModal doDelete={profileImgReset}>
          <h4>Delete Profile Picture?</h4>
          <p>
            Are you sure you want to delete {account.username}'s profile photo?
            This cannot be undone.
          </p>
        </DeleteModal>
      </Modal>
    </div>
  );
}

export default UserPanel;
