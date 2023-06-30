import React from 'react';
import '../../../stylesheets/Admin/Modal.css';

function DeleteCheckinModal({checkin, setModalState, doDelete, modalState}) {
    
    const handleClose = () => {
        const rootDiv = document.getElementById('root');  
        if (modalState) {
            rootDiv.classList.remove('Modal-noScroll');
        } else {
            rootDiv.classList.add('Modal-noScroll');
        }
        setModalState(false);
    }

    const handleDelete = () => {
        doDelete(checkin.id);
    }

    return (
        <div className="Modal-Overlay">
            <div className="Modal">
                <h4>Delete Checkin Id# {checkin.id}?</h4>
                <p>Are you sure you want to delete this check in? This change cannot be undone.</p>
                <div className="Modal-btns">
                <button id='delete-btn' onClick={handleDelete}>
                    Delete
                </button>
                <button onClick={handleClose}>
                    Cancel
                </button>
                </div>
            </div>    
        </div>

    )
}

export default DeleteCheckinModal;