function PageButtons({ paginated, decrementPage, incrementPage, page }) {
  let isPrev;
  let isNext;

  if (paginated) {
    isPrev = paginated.previous ? false : true;
    isNext = paginated.next ? false : true;
  } else {
    isPrev = true;
    isNext = true;
  }

  return (
    <div className="UserPageCheckins">
      <div className="button-container">
        <button className="prev-btn" onClick={decrementPage} disabled={isPrev}>
          prev
        </button>
        <p>
          Page {page} of {paginated?.endPage}
        </p>
        <button className="next-btn" onClick={incrementPage} disabled={isNext}>
          next
        </button>
      </div>
    </div>
  );
}

export default PageButtons;
