import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";
import { useDiscs } from "../hooks/useDiscContext";
import udisc_url from "../assets/udisc-logo.png";
import "../stylesheets/DiscCheck.css";
import format from "date-fns/format";
import { Skeleton } from "./Skeletons/Skeleton";
import Modal from "./modals/Modal";
import DeleteCheckinModal from "./modals/Content/DeleteCheckinModal";
import DiscTrackerAPI from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";

function DiscCheck({ checkin, fetchCheckins, getDiscData = null }) {
  const { discs } = useDiscs();
  const { user } = useUser();
  const [modalState, setModalState] = useState();
  const disc = discs?.filter(d => d.id == checkin.discId)[0] || [];

  const doDelete = async () => {
    try {
      await DiscTrackerAPI.deleteCheckIn(checkin.id, user.username);
      await fetchCheckins();
      if (getDiscData) await getDiscData(checkin.discId);
    } catch (err) {
      console.error(err);
    }
  };

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
            <span style={{ fontWeight: "600" }}>
              {checkin.username ? checkin.username : "Anonymous"}
            </span>
          </>
        ) : window.location.pathname.includes("/myaccount/checkins") ? (
          <>
            <span style={{ fontWeight: "600" }}>{disc.name}</span> checked in at{" "}
            {format(new Date(checkin.date), "p")}
          </>
        ) : (
          <>
            Checked in by:{" "}
            <span style={{ fontWeight: "600" }}>
              {checkin.username ? checkin.username : "Anonymous"}
            </span>
          </>
        )}
      </span>
      <ul>
        <li>{checkin.courseName}</li>
        <li>
          {checkin.city}, {checkin.state} {checkin.zip}
        </li>

        {checkin.note && (
          <>
            <li className="note-li">{checkin?.note}</li>
          </>
        )}
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
        {user && (user?.isAdmin || checkin.username == user?.username) && (
          <Link to={`/checkins/${checkin.id}/edit`}>
            <div className="link edit-checkin-btn">Edit</div>
          </Link>
        )}
        {user && (user?.isAdmin || checkin.username == user?.username) && (
          <Link>
            <div
              className="link delete-checkin-btn"
              onClick={() => setModalState(true)}
            >
              Delete
            </div>
          </Link>
        )}
      </div>
      <Modal setModalState={setModalState} modalState={modalState}>
        <DeleteCheckinModal checkin={checkin} doDelete={doDelete} />
      </Modal>
    </div>
  );
}

export function DiscCheckSkeleton() {
  return <div className="DiscCheck DiscCheck-skeleton"></div>;
}

export default DiscCheck;
