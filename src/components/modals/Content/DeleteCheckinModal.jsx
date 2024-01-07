import React from "react";
import "../../../stylesheets/Admin/Modal.css";
import DiscTrackerAPI from "../../../api";
import { useUser } from "../../../hooks/useUserContext";

function DeleteCheckinModal({ checkin, handleClose, doDelete }) {
  const handleDelete = async () => {
    await doDelete();
    handleClose();
  };

  return (
    <div className="modal-body">
      <h4>Delete Checkin at {checkin.courseName}?</h4>
      <p>
        Are you sure you want to delete this check in? This change cannot be
        undone.
      </p>
      <div className="Modal-btns">
        <button id="delete-btn" onClick={handleDelete}>
          Delete
        </button>
        <button onClick={handleClose}>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteCheckinModal;
