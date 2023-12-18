import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DiscTrackerAPI from "../api";
import DiscCheck from "./DiscCheck";
import defaultDiscImg from "../assets/disc-images/default-disc.png";
import { Skeleton } from "./Skeletons/Skeleton";
import { SkeletonH2Subtitle } from "./Skeletons/Skeleton";
import { SkeletonList } from "./Skeletons/Skeleton";
import { DiscCheckSkeleton } from "./DiscCheck";
import "../stylesheets/Disc.css";

const INIT_PAGE = 1;
const NUM_PAGE_ITEMS = 5;

function Disc({ discs }) {
  const { discId } = useParams();
  const [disc, setDisc] = useState(null);
  const [distance, setDistance] = useState(null);
  const [checkins, setCheckins] = useState();
  const [loadState, setLoadState] = useState("load");
  const [page, setPage] = useState(INIT_PAGE);

  console.log("page re-rendered");

  useEffect(() => {
    console.log("getting disc..");
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
    changePage(INIT_PAGE);
  }, []);

  // I probably don't need a useEffect here. Disabled for now.
  // useEffect(() => {
  //   console.log("fetching check ins..");
  //   async function fetchCheckins() {
  //     try {
  //       const results = await DiscTrackerAPI.getCheckins(
  //         discId,
  //         NUM_PAGE_ITEMS,
  //         page
  //       );
  //       setCheckins(results);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     setLoadState("ready");
  //   }
  //   fetchCheckins();
  // }, [page]);

  const changePage = idx => {
    console.log("fetching check ins..");
    async function fetchCheckins() {
      try {
        const results = await DiscTrackerAPI.getCheckins(
          discId,
          NUM_PAGE_ITEMS,
          idx
        );
        setCheckins(results);
      } catch (err) {
        console.log(err);
      }
      setLoadState("ready");
    }
    fetchCheckins();
  };

  // if (loadState !== "ready") {
  //   return <div>Loading..</div>;
  // }

  if (discs && !discs.some(disc => +disc.id === +discId)) {
    return (
      <div>
        <p>404 - Disc not found</p>
      </div>
    );
  }

  const incrementPage = () => {
    setLoadState("fetching-checkins");
    if (page < checkins.endPage) setPage(p => p + 1);
    changePage(page + 1);
  };
  const decrementPage = () => {
    setLoadState("fetching-checkins");
    if (page > 1) setPage(p => p - 1);
    changePage(page - 1);
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

  // to replace image if image URL is not found/forbidden.
  function replaceImage(error) {
    error.target.src = defaultDiscImg;
  }

  const imgURL = `/src/assets/disc-images/disc-${discId}.png`;

  return (
    <div className="Disc">
      <h2 className={loadState == "load" ? "skeleton-h2" : undefined}>
        {loadState == "load" ? (
          <Skeleton size={"75vw"} />
        ) : (
          <>
            {disc?.plastic} {disc?.name}
          </>
        )}
      </h2>
      <span id="subtitle">
        {loadState == "load" ? (
          <SkeletonH2Subtitle size={"50vw"} />
        ) : (
          <>{disc?.manufacturer}</>
        )}
      </span>
      <div className="top-container">
        <div className="top-left">
          {loadState == "load" ? (
            <Skeleton />
          ) : (
            <img src={imgURL} alt={`Disc Golf Disc`} onError={replaceImage} />
          )}
        </div>
        <div className="top-right">
          {loadState == "load" ? (
            <>
              <Skeleton size={"90%"} />
            </>
          ) : (
            <>
              {checkins && (
                <p>This disc has travelled {Math.ceil(distance)} miles!</p>
              )}
              {!checkins && <p>No check ins found for this disc!</p>}
            </>
          )}
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
        {loadState == "load" || loadState == "fetching-checkins" ? (
          <>
            <SkeletonList amount={5}>
              <DiscCheckSkeleton />
            </SkeletonList>
          </>
        ) : (
          <>
            {checkins.results.map(checkin => (
              <DiscCheck key={checkin.id} checkin={checkin} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Disc;
