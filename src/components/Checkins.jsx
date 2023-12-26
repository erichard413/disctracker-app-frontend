import React, { useState } from "react";
import DiscCard from "./DiscCard";
import { useDiscs } from "../hooks/useDiscContext";
import "../stylesheets/Checkins.css";
import { paginatedResults } from "../helpers/paginatedResults";

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

  return (
    <div className="Checkins">
      <h2>Select Disc</h2>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <div className="button-container">
        <button onClick={decrementPage} disabled={page == INIT_PAGE}>
          prev
        </button>
        <p>Page {page}</p>
        <button
          onClick={incrementPage}
          disabled={paginatedDiscs.endPage == page}
        >
          next
        </button>
      </div>

      {discs &&
        paginatedDiscs.results.map(disc => (
          <DiscCard key={disc.id} disc={disc} />
        ))}
    </div>
  );
}

export default Checkins;
