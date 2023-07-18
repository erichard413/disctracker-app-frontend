import React from 'react';
import '../../stylesheets/Admin/Modal.css';
import { useNavigate } from 'react-router-dom';

function SuccessModal({setModalState, modalState, modalMessage}) {
    const navigate = useNavigate();
    
    const handleClose = () => {
        const rootDiv = document.getElementById('root');  
        if (modalState) {
            rootDiv.classList.remove('Modal-noScroll');
        } else {
            rootDiv.classList.add('Modal-noScroll');
        }
        setModalState(false);
        navigate('/', {replace: true});
    }

    return (
        <div className="Modal-Overlay">
            <div className="Modal">
                <h4>Checkin Successful</h4>
                {modalMessage && <p>{modalMessage}</p>}
                <div className="Modal-btns">
                <button onClick={handleClose}>
                    Confirm
                </button>
                </div>
            </div>    
        </div>

    )
}

export default SuccessModal;