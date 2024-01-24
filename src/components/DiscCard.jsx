import React from "react";
import { useNavigate } from "react-router-dom";
import defaultDiscImg from "../assets/disc-images/default-disc.png";
import { Link } from "react-router-dom";
import "../stylesheets/DiscCard.css";
import { useUser } from "../hooks/useUserContext";
import { Skeleton } from "./Skeletons/Skeleton";

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

  return (
    <div className="DiscCard">
      <div className="container">
        <div className="container-left">
          <img
            src={disc.imgUrl ? disc.imgUrl : defaultDiscImg}
            alt={`Disc Golf Disc`}
            onError={replaceImage}
          />
        </div>
        <div className="container-right">
          <ul>
            <li>
              <h4 className="bolded-text">
                {disc.manufacturer} - {disc.name}
              </h4>
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

export function DiscCardSkeleton() {
  return (
    <div className="DiscCard">
      <div className="container">
        <div className="container-left">
          <Skeleton height="90px" width="90px" />
        </div>
        <div className="container-right">
          <ul>
            <li>
              <Skeleton width="150px" height="24px" />
            </li>
            <li>
              <Skeleton width="115px" height="24px" />
            </li>
            <li>
              <div className="buttons-container">
                <Skeleton width="50px" height="32px" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DiscCard;
