import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";
import { useDiscs } from "../hooks/useDiscContext";
import DeleteCheckinModal from "./Admin/modals/DeleteCheckinModal";
import udisc_url from "../assets/udisc-logo.png";
import "../stylesheets/DiscCheck.css";
import format from "date-fns/format";
import { Skeleton } from "./Skeletons/Skeleton";

function DiscCheck({
  checkin,
  modalState,
  setModalState,
  doDelete,
  setSelectedCheckin,
}) {
  const { discs } = useDiscs();
  const { user } = useUser();
  const disc = discs?.filter(d => d.id == checkin.discId)[0] || [];

  return (
    <div className="DiscCheck">
      <span className="Disc-check-title">
        {format(new Date(checkin.date), "EEEE LLLL dd, yyyy")}
      </span>
      <span className="Disc-check-subtitle">
        {window.location.pathname.includes("/admin/checkins") ? (
          <>
            <span style={{ fontWeight: "600" }}>{disc.name}</span> checked in
            by:{" "}
          </>
        ) : (
          <>Checked in by: </>
        )}
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
        {(user?.isAdmin || checkin.username == user?.username) && (
          <Link to={`/checkins/${checkin.id}/edit`}>
            <div className="link edit-checkin-btn">Edit</div>
          </Link>
        )}
      </div>
    </div>
  );
}

export function DiscCheckSkeleton() {
  return <div className="DiscCheck DiscCheck-skeleton"></div>;
}

export default DiscCheck;
