import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import DiscTrackerAPI from '../api';
import DeleteCheckinModal from './Admin/modals/DeleteCheckinModal';

function DiscCheck({checkin, user, modalState, setModalState, doDelete, setSelectedCheckin}) {
    
    
    // const handleDeleteToggle = () => {
    //     const rootDiv = document.getElementById('root');
        
    //     if (modalState) {
    //         rootDiv.classList.remove('Modal-noScroll');
    //     } else {
    //         rootDiv.classList.add('Modal-noScroll');
    //     }
        
    //     setSelectedCheckin(checkin);
    //     setModalState(!modalState);
    // }

    if (!checkin || !user) {
        return (
            <div>Loading..</div>
        )
    }
    
    return(
        <div className="DiscCheck">
            <p>
                {checkin.date}
            </p>
            <ul>
                <li>{checkin.courseName}</li>
                <li>{checkin.city}, {checkin.state} {checkin.zip}</li>
                <li>Checked in by: {checkin.username || "Anonymous"}</li>
            </ul>
            {/* <div className="options-div">
                {user && (user.username === checkin.username || user.isAdmin) && 
                <Link to={`/checkins/${checkin.id}/edit`}>
                    <button type="button">Edit</button>
                </Link>
                }
                {user && (user.isAdmin) &&
                    <button type="button" onClick={handleDeleteToggle}>Delete</button>
                }
            </div> */}
        </div>
    )
}

export default DiscCheck