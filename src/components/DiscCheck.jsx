import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";
import { useDiscs } from "../hooks/useDiscContext";
import udisc_url from "../assets/udisc-logo.png";
import "../stylesheets/DiscCheck.css";
import format from "date-fns/format";
import { Skeleton } from "./Skeletons/Skeleton";
import Modal from "./modals/Modal";
import DeleteModal from "./modals/Content/DeleteModal";
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
            <span style={{ fontWeight: "600" }}>
              <Link to={`/discs/${disc.id}`}>{disc.name}</Link>
            </span>{" "}
            checked in by:{" "}
            <span style={{ fontWeight: "600" }}>
              {checkin.username ? (
                <Link to={`/users/${checkin.username}`}>
                  {checkin.username}
                </Link>
              ) : (
                "Anonymous"
              )}
            </span>
          </>
        ) : window.location.pathname.includes("/myaccount/checkins") ? (
          <>
            <span style={{ fontWeight: "600" }}>
              <Link to={`/discs/${disc.id}`}>{disc.name}</Link>
            </span>{" "}
            checked in at {format(new Date(checkin.date), "p")}
          </>
        ) : (
          <>
            Checked in by:{" "}
            <span style={{ fontWeight: "600" }}>
              {checkin.username ? (
                <Link to={`/users/${checkin.username}`}>
                  {checkin.username}
                </Link>
              ) : (
                "Anonymous"
              )}
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
          target="_blank"
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
        <DeleteModal doDelete={doDelete}>
          <h4>Delete Checkin at {checkin.courseName}?</h4>
          <p>
            Are you sure you want to delete this check in? This change cannot be
            undone.
          </p>
        </DeleteModal>
      </Modal>
    </div>
  );
}

export function DiscCheckSkeleton() {
  return (
    <div className="DiscCheck DiscCheckSkeleton">
      <Skeleton width={"160px"} height={"30px"} />

      <span className="Disc-check-subtitle">
        {window.location.pathname.includes("/admin/checkins") ? (
          <>
            <Skeleton width={"50px"} height={"23px"} /> checked in by:{" "}
            <Skeleton
              width={"60px"}
              height={window.innerWidth < 480 ? "16px" : "1.4rem"}
            />
          </>
        ) : window.location.pathname.includes("/myaccount/checkins") ? (
          <>
            <Skeleton
              width={"50px"}
              height={window.innerWidth < 480 ? "16px" : "1.4rem"}
            />{" "}
            checked in at{" "}
            <Skeleton
              width={"60px"}
              height={window.innerWidth < 480 ? "16px" : "1.4rem"}
            />
          </>
        ) : (
          <>
            Checked in by:{" "}
            <Skeleton
              width={"60px"}
              height={window.innerWidth < 480 ? "16px" : "1.4rem"}
            />
          </>
        )}
      </span>
      <ul>
        <li>
          <Skeleton width={"200px"} height={"33px"} />
        </li>
        <li>
          <Skeleton width={"150px"} />
        </li>
      </ul>
      <div className="skeleton-button-container">
        <Skeleton width={"50px"} height={"20px"} />
      </div>
    </div>
  );
}

export default DiscCheck;
