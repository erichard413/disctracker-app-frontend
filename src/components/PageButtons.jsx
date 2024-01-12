function PageButtons({
  paginated,
  next,
  previous,
  endPage,
  decrementPage,
  incrementPage,
  page,
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
      <div className="button-container">
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

export default PageButtons;
