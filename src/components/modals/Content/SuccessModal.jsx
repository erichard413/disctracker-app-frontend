export function SuccessModal({ modalTitle, modalMessage, handleClose }) {
  return (
    <div className="modal-body">
      <h4>{modalTitle}</h4>
      {modalMessage && <p>{modalMessage}</p>}
      <div className="Modal-btns">
        <button onClick={handleClose}>Confirm</button>
      </div>
    </div>
  );
}
