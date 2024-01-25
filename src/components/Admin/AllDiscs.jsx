import { useDiscs } from "../../hooks/useDiscContext";
import { useEffect, useRef, useState } from "react";
import { AdminDiscsSearchForm } from "../../forms/Admin/AdminDiscsSearchForm";

import "../../stylesheets/Admin/AllDiscs.css";
import { paginatedResults } from "../../helpers/paginatedResults";
import defaultDiscImg from "../../assets/disc-images/default-disc.png";
import Modal from "../modals/Modal";
import DeleteModal from "../modals/Content/DeleteModal";
import DiscTrackerAPI from "../../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PageButtons from "../PageButtons";

const INIT_PAGE = 1;
const INIT_LIMIT = 10;

function AllDiscs() {
  const { discs, setDiscs } = useDiscs();
  const [currentDiscs, setCurrentDiscs] = useState([]);
  const [page, setPage] = useState(INIT_PAGE);
  const [modalState, setModalState] = useState(false);
  const [loadState, setloadState] = useState(true);
  const currentDiscRef = useRef();

  useEffect(() => {
    if (discs) {
      setCurrentDiscs(paginatedResults(discs, INIT_PAGE, INIT_LIMIT));
      setloadState(false);
    }
  }, [discs]);

  async function doDelete() {
    await DiscTrackerAPI.deleteDisc(currentDiscRef.current);
    setDiscs(d => d.filter(disc => disc.id !== currentDiscRef.current));
    currentDiscRef.current = null;
  }

  function incrementPage() {
    setCurrentDiscs(paginatedResults(discs, page + 1, INIT_LIMIT));
    setPage(p => p + 1);
  }
  function decrementPage() {
    setCurrentDiscs(paginatedResults(discs, page - 1, INIT_LIMIT));
    setPage(p => p - 1);
  }

  if (loadState) return "LOADING...";

  return (
    <div className="AllDiscs">
      <h2>All Discs</h2>
      <AdminDiscsSearchForm setCurrentDiscs={setCurrentDiscs} />
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>

      <div className="disc-card-container">
        <PageButtons
          page={page}
          decrementPage={decrementPage}
          incrementPage={incrementPage}
          paginated={currentDiscs.results}
          next={currentDiscs.next}
          endPage={currentDiscs.endPage}
          previous={currentDiscs.previous}
          emptyMsg="No discs found!"
        />
        {currentDiscs.results?.map(d => (
          <AdminDiscCard
            key={d.id}
            disc={d}
            currentDiscRef={currentDiscRef}
            setModalState={setModalState}
          />
        ))}
      </div>

      <Modal modalState={modalState} setModalState={setModalState}>
        <DeleteModal doDelete={doDelete}>
          <h4>Delete Disc {currentDiscRef.current}?</h4>
          <p>
            Are you sure you want to delete this disc? This change cannot be
            undone.
          </p>
        </DeleteModal>
      </Modal>
    </div>
  );
}

function AdminDiscCard({ disc, currentDiscRef, setModalState }) {
  // to replace image if image URL is not found/forbidden.
  function replaceImage(error) {
    error.target.src = defaultDiscImg;
  }

  function handleDeleteClick(e) {
    e.preventDefault();
    currentDiscRef.current = disc.id;
    setModalState(true);
  }

  return (
    <div className="AdminDiscCard">
      <div className="left-container">
        <img
          src={disc.imgUrl ? disc.imgUrl : defaultDiscImg}
          alt={`Disc Golf Disc`}
          onError={replaceImage}
        />
      </div>
      <div className="right-container">
        <ul>
          <li>
            {disc.manufacturer} {disc.name}
          </li>
          <li>ID: {disc.id}</li>
          <li>Plastic: {disc.plastic}</li>
        </ul>
        <div className="buttons-container">
          <Link to={`/discs/${disc.id}`}>
            <button>View</button>
          </Link>
          <Link to={`/discs/${disc.id}/edit`}>
            <button>Edit</button>
          </Link>
          <button onClick={handleDeleteClick}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default AllDiscs;
