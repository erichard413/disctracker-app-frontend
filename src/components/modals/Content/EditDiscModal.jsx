import React from "react";
import "../../../stylesheets/modals/Content/LoginModal.css";
import { EditDiscForm } from "../../../forms/Admin/EditDiscForm";

function EditDiscModal({ setModalState, modalState, handleClose, disc }) {
  return (
    <div className="LoginModal modal-body">
      <h2>Editing Disc</h2>
      <EditDiscForm />
    </div>
  );
}

export default EditDiscModal;
