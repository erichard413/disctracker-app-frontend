import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

function DiscCheck({checkin, user}) {
    return(
        <div className="DiscCheck">
            <p>
                {checkin.date}
            </p>
            <ul>
                <li>{checkin.courseName}</li>
                <li>{checkin.city} {checkin.state} {checkin.zip}</li>
                <li>Checked in by: {checkin.username || "Anonymous"}</li>
            </ul>
            <div className="options-div">
                {user && (user.username === checkin.username) && 
                <Link to={`/checkins/${checkin.id}/edit`}>
                    <button type="button">Edit</button>
                </Link>
                }
            </div>
        </div>
    )
}

export default DiscCheck