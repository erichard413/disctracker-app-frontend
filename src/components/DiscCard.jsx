import React from 'react';
import { useNavigate } from 'react-router-dom';

function DiscCard({disc}) {
    const navigate = useNavigate();
    const handleClick = (e) => {
        e.preventDefault();
        navigate(`/discs/${disc.id}`)
    }
    return (
        <div className="DiscCard" onClick={handleClick}>
            <h3>{disc.name}</h3>
            <ul>
                <li>{disc.id}</li>
                <li>{disc.manufacturer}</li>
                <li>{disc.plastic}</li>
            </ul>
        </div>
    )
}

export default DiscCard