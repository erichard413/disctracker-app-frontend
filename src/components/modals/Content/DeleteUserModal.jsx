import React, { useState } from "react";
import "../../../stylesheets/modals/Content/DeleteUserModal.css";

function DeleteUserModal({ username, doDelete, handleClose }) {
  const [formData, setFormData] = useState({ username: "" });

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(data => ({
      ...data,
      [name]: value.replace(/\s/g, ""),
    }));
  };

  const disabled =
    formData.username.toLowerCase() === username.toLowerCase() ? false : true;

  return (
    <div className="DeleteUserModal modal-body">
      <h4>Delete User - {username}?</h4>
      <p>
        Are you sure you want to delete this user? This change cannot be undone.
        To confirm, enter the username below and select "Delete".
      </p>
      <input
        id="username-input"
        onChange={handleChange}
        value={formData.username}
        placeholder="Username"
        type="text"
        name="username"
      />
      <div className="Modal-btns">
        <button id="delete-btn" onClick={doDelete} disabled={disabled}>
          Delete
        </button>

        <button onClick={handleClose}>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteUserModal;
