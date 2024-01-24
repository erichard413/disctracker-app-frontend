import React from "react";
import "../../../stylesheets/Admin/Modal.css";
import DiscTrackerAPI from "../../../api";
import { useUser } from "../../../hooks/useUserContext";

function DeleteModal({ handleClose, doDelete, children }) {
  return (
    <div className="modal-body">
      {children}

      <div className="Modal-btns">
        <button onClick={handleClose}>Cancel</button>
        <button
          id="delete-btn"
          onClick={async () => {
            await doDelete();
            handleClose();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
