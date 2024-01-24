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
import PageButtons, { PageButtonsSkeleton } from "./PageButtons";

const INIT_PAGE = 1;
const NUM_PAGE_ITEMS = 5;

function Disc() {
  const { discs } = useDiscs();
  const { discId } = useParams();
  const [checkins, setCheckins] = useState([]);
  const [stats, setStats] = useState();
  const [page, setPage] = useState(INIT_PAGE);
  const [checkinLoadState, setCheckinLoadState] = useState(true);

  console.log("page re-rendered");

  useEffect(() => {
    getDiscData();
    fetchCheckins(INIT_PAGE);
  }, []);

  const disc = discs ? discs.filter(d => d.id == discId)[0] : null;

  console.log(disc);

  const getDiscData = async () => {
    console.log("getting disc data");
    try {
      const discStats = await DiscTrackerAPI.getStatsForDisc(discId);
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

    setCheckinLoadState(false);
  };

  // if (loadState !== "ready") {
  //   return <div>Loading..</div>;
  // }

  if (discs && !discs.some(disc => disc.id == discId)) {
    return (
      <div>
        <p>404 - Disc not found</p>
      </div>
    );
  }

  const incrementPage = () => {
    if (page < checkins.endPage) setPage(p => p + 1);
    fetchCheckins(page + 1);
  };
  const decrementPage = () => {
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

  return (
    <div className="Disc">
      {!disc || !stats ? (
        <HeaderSkeleton />
      ) : (
        <>
          <div>
            <h2>
              {disc?.plastic} {disc?.name}
            </h2>
            <span id="subtitle">{disc?.manufacturer}</span>
            <div className="top-container">
              <div className="top-left">
                <img
                  src={disc?.imgUrl ? disc.imgUrl : defaultDiscImg}
                  alt={`Disc Golf Disc`}
                  onError={replaceImage}
                />
              </div>
              <div className="top-right">
                {stats && (
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
                        <span className="bold-me">{stats.stateCount}</span>{" "}
                        state
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
              </div>
            </div>
          </div>
        </>
      )}

      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <div id="checkins-subtitle">
        <p>Where This Disc Has Been</p>
      </div>

      <>
        <PageButtons
          page={page}
          decrementPage={decrementPage}
          incrementPage={incrementPage}
          paginated={checkins?.results}
          next={checkins?.next}
          endPage={checkins?.endPage}
          previous={checkins?.previous}
        />
      </>

      {!checkinLoadState && checkins?.length == 0 && (
        <p>This disc has never been checked in!</p>
      )}

      <div className="checkins-container">
        {checkinLoadState ? (
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

function HeaderSkeleton() {
  return (
    <div className="header-skeleton">
      <span className="title">
        <Skeleton width="180px" height="35px" />
      </span>

      <span className="subtitle">
        <Skeleton width="120px" height="22px" />
      </span>
      <div className="top-container">
        <div className="top-left">
          <Skeleton width="130px" height="130px" />
        </div>
        <div className="top-right">
          <ul>
            <li>
              <Skeleton width={"165px"} />
            </li>
            <li>
              <Skeleton width={"115px"} />
            </li>
            <li>
              <Skeleton width={"85px"} />
            </li>
            <li>
              <Skeleton width={"115px"} />
            </li>
            <Skeleton width={"150px"} />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Disc;
