import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DiscTrackerAPI from "../api";
import DiscCheck from "./DiscCheck";
import defaultDiscImg from "../assets/default-disc.png";
import "../stylesheets/Disc.css";

function Disc({ discs, user }) {
  const { discId } = useParams();
  const [disc, setDisc] = useState(null);
  const [distance, setDistance] = useState(null);
  const [checkins, setCheckins] = useState();
  const [loadState, setLoadState] = useState("load");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getDiscData = async () => {
      try {
        const distanceData = await DiscTrackerAPI.getDistanceForDisc(discId);
        const discData = await DiscTrackerAPI.getDisc(discId);
        setDisc(discData);
        setDistance(distanceData);
      } catch (err) {
        console.log(err);
      }
    };
    getDiscData();
  }, []);

  useEffect(() => {
    async function fetchCheckins() {
      try {
        const results = await DiscTrackerAPI.getCheckins(discId, 5, page);
        setCheckins({ ...results });
      } catch (err) {
        console.log(err);
      }
      setLoadState("ready");
    }
    fetchCheckins();
  }, [page]);

  if (loadState !== "ready") {
    return <div>Loading..</div>;
  }

  if (discs && !discs.some(disc => +disc.id === +discId)) {
    return (
      <div>
        <p>404 - Disc not found</p>
      </div>
    );
  }

  const incrementPage = () => {
    if (page < checkins.endPage) setPage(p => p + 1);
  };
  const decrementPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  let isPrev;
  let isNext;

  if (checkins) {
    isPrev = checkins.previous ? false : true;
    isNext = checkins.next ? false : true;
  } else {
    isPrev = true;
    isNext = true;
  }

  const imgUrl = `../assets/disc-${discId}.png`;
  // to replace image if image URL is not found/forbidden.
  function replaceImage(error) {
    error.target.src = defaultDiscImg;
  }

  return (
    <div className="Disc">
      <h2>
        {disc?.plastic} {disc?.name}
      </h2>
      <span id="subtitle">{disc?.manufacturer}</span>
      <div className="top-container">
        <div className="top-left">
          <img src={imgUrl} alt={`Disc Golf Disc`} onError={replaceImage} />
        </div>
        <div className="top-right">
          {checkins && (
            <p>This disc has travelled {Math.ceil(distance)} miles!</p>
          )}
          {!checkins && <p>No check ins found for this disc!</p>}
        </div>
      </div>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <div id="checkins-subtitle">
        <p>Where This Disc Has Been</p>
      </div>
      <div className="button-container">
        <button onClick={decrementPage} disabled={isPrev}>
          prev
        </button>
        <p>Page {page}</p>
        <button onClick={incrementPage} disabled={isNext}>
          next
        </button>
      </div>

      <div className="checkins-container">
        {checkins &&
          checkins.results.map(checkin => (
            <DiscCheck key={checkin.id} checkin={checkin} user={user} />
          ))}
      </div>
    </div>
  );
}

export default Disc;
