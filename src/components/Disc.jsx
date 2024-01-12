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
import { useDiscs } from "../hooks/useDiscContext";
import { useCheckins } from "../hooks/useCheckinsContext";
import PageButtons from "./PageButtons";

const INIT_PAGE = 1;
const NUM_PAGE_ITEMS = 5;

function Disc() {
  const { discs } = useDiscs();
  const { discId } = useParams();
  // const [disc, setDisc] = useState(() =>
  //   discs ? discs.filter(d => d?.id == discId) : null
  // );
  const [checkins, setCheckins] = useState([]);
  const [stats, setStats] = useState();
  const [loadState, setLoadState] = useState("load");
  const [page, setPage] = useState(INIT_PAGE);
  const disc = discs?.filter(d => d?.id == discId);

  console.log("page re-rendered");

  useEffect(() => {
    getDiscData();
    fetchCheckins(INIT_PAGE);
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

  const getDiscData = async () => {
    try {
      const discStats = await DiscTrackerAPI.getStatsForDisc(discId);
      // if (!disc) {
      //   console.log("getting disc..");
      //   const discData = await DiscTrackerAPI.getDisc(discId);
      //   setDisc(discData);
      // }

      setStats(discStats);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCheckins = async (idx = INIT_PAGE) => {
    console.log("fetching check ins..");
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
    fetchCheckins(page + 1);
  };
  const decrementPage = () => {
    setLoadState("fetching-checkins");
    if (page > 1) setPage(p => p - 1);
    fetchCheckins(page - 1);
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
              {checkins && stats && (
                <>
                  <ul>
                    <li>
                      This disc has travelled{" "}
                      <span className="bold-me">
                        {Math.ceil(stats.distance)}
                      </span>{" "}
                      miles!
                    </li>
                    <li>
                      Played on{" "}
                      <span className="bold-me">{stats.courseCount}</span>{" "}
                      course{stats.courseCount > 1 && "s"}!
                    </li>
                    <li>
                      Visited{" "}
                      <span className="bold-me">{stats.stateCount}</span> state
                      {stats.stateCount > 1 && "s"}!
                    </li>
                    <li>
                      Checked in by{" "}
                      <span className="bold-me">{stats.userCount}</span> user
                      {stats.userCount > 1 && "s"}!
                    </li>
                    {stats.countryCount > 1 && (
                      <li>
                        This disc has been to{" "}
                        <span className="bold-me">{stats.countryCount}</span>{" "}
                        countries!
                      </li>
                    )}
                  </ul>
                </>
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
      {checkins.results && (
        <PageButtons
          page={page}
          decrementPage={decrementPage}
          incrementPage={incrementPage}
          paginated={checkins.results}
          next={checkins.next}
          endPage={checkins.endPage}
          previous={checkins.previous}
        />
      )}
      {!checkins.results && <p>This disc has never been checked in!</p>}

      <div className="checkins-container">
        {loadState == "load" || loadState == "fetching-checkins" ? (
          <>
            <SkeletonList amount={5}>
              <DiscCheckSkeleton />
            </SkeletonList>
          </>
        ) : (
          <>
            {checkins?.results?.map(checkin => (
              <DiscCheck
                key={checkin.id}
                checkin={checkin}
                getDiscData={getDiscData}
                fetchCheckins={fetchCheckins}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Disc;
