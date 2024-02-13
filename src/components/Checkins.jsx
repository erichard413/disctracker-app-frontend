import React, { useState, useEffect } from "react";
import DiscCard from "./DiscCard";
import { useDiscs } from "../hooks/useDiscContext";
import "../stylesheets/Checkins.css";
import { paginatedResults } from "../helpers/paginatedResults";
import PageButtons from "./PageButtons";
import { PageButtonsSkeleton } from "./PageButtons";
import { Skeleton, SkeletonList } from "./Skeletons/Skeleton";
import { DiscCardSkeleton } from "./DiscCard";

const INIT_PAGE = 1;
const NUM_PAGE_ITEMS = 4;

function Checkins() {
  const { discs } = useDiscs();
  const [loadState, setLoadState] = useState(true);
  const [page, setPage] = useState(INIT_PAGE);
  useEffect(() => {
    if (discs) {
      setLoadState(false);
    }
  }, [discs]);

  const incrementPage = () => {
    if (page < paginatedDiscs.endPage) setPage(p => p + 1);
  };
  const decrementPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const paginatedDiscs = discs
    ? paginatedResults(discs, page, NUM_PAGE_ITEMS)
    : null;

  return (
    <div className="Checkins">
      <h2>Select Disc</h2>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>

      {loadState || !paginatedDiscs ? (
        <PageButtonsSkeleton />
      ) : (
        <PageButtons
          page={page}
          decrementPage={decrementPage}
          incrementPage={incrementPage}
          paginated={paginatedDiscs?.results}
          next={paginatedDiscs?.next}
          endPage={paginatedDiscs?.endPage}
          previous={paginatedDiscs?.previous}
        />
      )}

      {!loadState &&
        paginatedDiscs &&
        paginatedDiscs?.results.map(disc => (
          <DiscCard key={disc.id} disc={disc} />
        ))}
      {(loadState || !paginatedDiscs) && (
        <SkeletonList amount={NUM_PAGE_ITEMS}>
          <DiscCardSkeleton />
        </SkeletonList>
      )}
    </div>
  );
}

export default Checkins;
