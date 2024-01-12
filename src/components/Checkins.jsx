import React, { useState } from "react";
import DiscCard from "./DiscCard";
import { useDiscs } from "../hooks/useDiscContext";
import "../stylesheets/Checkins.css";
import { paginatedResults } from "../helpers/paginatedResults";
import PageButtons from "./PageButtons";

const INIT_PAGE = 1;
const NUM_PAGE_ITEMS = 4;

function Checkins() {
  const { discs } = useDiscs();
  const [page, setPage] = useState(INIT_PAGE);

  const incrementPage = () => {
    if (page < paginatedDiscs.endPage) setPage(p => p + 1);
  };
  const decrementPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  let paginatedDiscs;
  if (discs) {
    paginatedDiscs = paginatedResults(discs, page, NUM_PAGE_ITEMS);
  }

  if (!discs) return null;

  return (
    <div className="Checkins">
      <h2>Select Disc</h2>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <PageButtons
        page={page}
        decrementPage={decrementPage}
        incrementPage={incrementPage}
        paginated={paginatedDiscs.results}
        next={paginatedDiscs.next}
        endPage={paginatedDiscs.endPage}
        previous={paginatedDiscs.previous}
      />
      {discs &&
        paginatedDiscs?.results.map(disc => (
          <DiscCard key={disc.id} disc={disc} />
        ))}
    </div>
  );
}

export default Checkins;
