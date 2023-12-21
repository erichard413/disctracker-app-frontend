import React from "react";
import { useNavigate } from "react-router-dom";
import defaultDiscImg from "../assets/disc-images/default-disc.png";
import { Link } from "react-router-dom";
import "../stylesheets/DiscCard.css";
import { useUser } from "../hooks/useUserContext";

function DiscCard({ disc }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const handleClick = e => {
    e.preventDefault();
    navigate(`/discs/${disc.id}`);
  };
  // to replace image if image URL is not found/forbidden.
  function replaceImage(error) {
    error.target.src = defaultDiscImg;
  }

  const imgURL = `/src/assets/disc-images/disc-${disc.id}.png`;
  return (
    <div className="DiscCard">
      <h3>{disc.name}</h3>
      <div className="container">
        <div className="container-left">
          <img src={imgURL} alt={`Disc Golf Disc`} onError={replaceImage} />
        </div>
        <div className="container-right">
          <ul>
            <li>
              <h4 className="bolded-text">Manufacturer:</h4> {disc.manufacturer}
            </li>
            <li>
              <h4 className="bolded-text">Plastic: </h4> {disc.plastic}
            </li>
            <li>
              <div className="buttons-container">
                <button onClick={handleClick}>View</button>
                {user?.isAdmin && (
                  <button
                    onClick={() => {
                      navigate(`/discs/${disc.id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DiscCard;
