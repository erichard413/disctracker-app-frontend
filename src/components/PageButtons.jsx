import { Skeleton } from "./Skeletons/Skeleton";
import "../stylesheets/PageButtons.css";

function PageButtons({
  paginated = [],
  next,
  previous,
  endPage = 1,
  decrementPage,
  incrementPage,
  page = 1,
  emptyMsg = null,
}) {
  let isPrev;
  let isNext;

  if (paginated) {
    isPrev = previous ? false : true;
    isNext = next ? false : true;
  } else {
    isPrev = true;
    isNext = true;
  }
  if (paginated.length == 0) return <p>{emptyMsg}</p>;
  return (
    <div className="PageButtons">
      <div className="page-button-container">
        <button className="prev-btn" onClick={decrementPage} disabled={isPrev}>
          prev
        </button>
        <p>
          Page {page} of {endPage}
        </p>
        <button className="next-btn" onClick={incrementPage} disabled={isNext}>
          next
        </button>
      </div>
    </div>
  );
}

export function PageButtonsSkeleton() {
  return (
    <div className="PageButtons PageButtonsSkeleton">
      <div className="page-button-container">
        <button className="prev-btn" disabled={true}>
          prev
        </button>

        <Skeleton width={"67px"} height={"30px"} />

        <button className="next-btn" disabled={true}>
          next
        </button>
      </div>
    </div>
  );
}

export default PageButtons;
