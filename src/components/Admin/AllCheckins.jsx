import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../../api";
import DiscCheck from "../DiscCheck";
import DeleteCheckinModal from "./modals/DeleteCheckinModal";
import { useUser } from "../../hooks/useUserContext";
import { CheckinsSearchForm } from "../../forms/Admin/CheckinsSearchForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "../../stylesheets/AllCheckins.css";

const INIT_PAGE = 1;
const NUM_ITEMS_PER_PAGE = 5;

const initialFormData = {
  userName: "",
  courseName: "",
  date: "",
};

function AllCheckins() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState();
  const [formData, setFormData] = useState(initialFormData);
  const [loadState, setLoadState] = useState("load");
  const [page, setPage] = useState(INIT_PAGE);
  const [modalState, setModalState] = useState(false);
  const [search, setSearch] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState();

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/home");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchCheckins = async () => {
      const result = await DiscTrackerAPI.getAllCheckins(
        page,
        NUM_ITEMS_PER_PAGE,
        formData
      );
      setCheckins(result);
      setLoadState("ready");
    };
    fetchCheckins();
  }, [user, page]);

  if (user && !user.isAdmin) {
    navigate("/", { replace: true });
    return;
  }

  if (loadState !== "ready") {
    return <div>Loading..</div>;
  }

  const incrementPage = () => {
    if (page < checkins.endPage) setPage(page + 1);
  };
  const decrementPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const doDelete = checkin => {
    setSelectedCheckin(checkin);
    async function handleDelete() {
      const res = await DiscTrackerAPI.deleteCheckIn(checkin.id);
      return res;
    }
    setCheckins({
      ...checkins,
      results: checkins.results.filter(c => c.id !== checkin.id),
    });
    setSelectedCheckin();
    if (user.isAdmin) handleDelete();
  };

  let isPrev = checkins.previous ? false : true;
  let isNext = checkins.next ? false : true;

  return (
    <div className="AllCheckins">
      <h2>All Check Ins</h2>
      <div className="search-subtitle">
        <span onClick={() => setSearch(s => !s)}>
          <h4>Search </h4>
          <span className="chevrons">
            <FontAwesomeIcon icon={search ? faChevronUp : faChevronDown} />
            <FontAwesomeIcon icon={search ? faChevronUp : faChevronDown} />
          </span>
        </span>
      </div>
      {search && (
        <CheckinsSearchForm
          setCheckins={setCheckins}
          page={page}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <div className="button-container">
        <button onClick={decrementPage} disabled={isPrev}>
          prev
        </button>
        <p>
          Page {page} of {checkins.endPage !== 0 ? checkins.endPage : 1}
        </p>
        <button onClick={incrementPage} disabled={isNext}>
          next
        </button>
      </div>

      <ul>
        {checkins.results.map(checkin => (
          <li key={checkin.id}>
            <DiscCheck
              user={user}
              checkin={checkin}
              modalState={modalState}
              setModalState={setModalState}
              doDelete={doDelete}
              setSelectedCheckin={setSelectedCheckin}
            />
          </li>
        ))}
      </ul>
      {modalState && selectedCheckin && (
        <DeleteCheckinModal
          checkin={selectedCheckin}
          setModalState={setModalState}
          doDelete={doDelete}
          modalState={modalState}
        />
      )}
    </div>
  );
}

export default AllCheckins;
