import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import udisc_url from "../../assets/udisc-logo.png";
import "../../stylesheets/DiscCheck.css";
import format from "date-fns/format";
import { Skeleton } from "../Skeletons/Skeleton";
import { useDiscs } from "../../hooks/useDiscContext";

function AdminDiscCheck({
  checkin,
  modalState,
  setModalState,
  doDelete,
  setSelectedCheckin,
}) {
  const { discs } = useDiscs();
  const disc = discs.filter(d => d.id == checkin.discId)[0];

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

  // if (!checkin || !user) {
  //     return (
  //         <div>Loading..</div>
  //     )
  // }
  return (
    <div className="DiscCheck">
      <span className="Disc-check-title">
        {format(new Date(checkin.date), "EEEE LLLL dd, yyyy")}
      </span>

      <span className="Disc-check-subtitle">
        <span style={{ fontWeight: "600" }}>{disc.name}</span> checked in by:{" "}
        <span style={{ fontWeight: "600" }}>
          {checkin.username ? checkin.username : "Anonymous"}
        </span>
      </span>
      <ul>
        <li>{checkin.courseName}</li>
        <li>
          {checkin.city}, {checkin.state} {checkin.zip}
        </li>
      </ul>
      <div className="button-container">
        <Link
          to={`https://udisc.com/courses?courseTerm=${checkin.courseName.replaceAll(
            " ",
            "+"
          )}`}
        >
          <div className="link u-disc">
            <img src={udisc_url} alt="uDisc.com" />
          </div>
        </Link>
      </div>
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
  );
}

export function DiscCheckSkeleton() {
  return <div className="DiscCheck DiscCheck-skeleton"></div>;
}

export default AdminDiscCheck;
