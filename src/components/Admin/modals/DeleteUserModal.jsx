import React, {useState} from 'react';
import '../../../stylesheets/Admin/Modal.css';

function DeleteUserModal({username, setModalState, doDelete, modalState}) {
    const [formData, setFormData] = useState({username: ''});
    
    const handleClose = () => {
        const rootDiv = document.getElementById('root');  
        if (modalState) {
            rootDiv.classList.remove('Modal-noScroll');
        } else {
            rootDiv.classList.add('Modal-noScroll');
        }
        setModalState(false);
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }))
    }

    const disabled = formData.username.toLowerCase() === username.toLowerCase() ? false : true;

    return (
        <div className="Modal-Overlay">
            <div className="Modal">
                <h4>Delete User - {username}?</h4>
                <p>Are you sure you want to delete this user? This change cannot be undone. To confirm, enter the username below and select "Delete".</p>
                <input 
                    id="username-input"
                    onChange={handleChange}
                    value={formData.username}
                    placeholder="Username"
                    type="text"
                    name="username"
                />
            <div className="Modal-btns">
                <button id='delete-btn' onClick={doDelete} disabled={disabled}>
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

export default DeleteUserModal;