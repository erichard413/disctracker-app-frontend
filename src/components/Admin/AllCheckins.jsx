import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../../api";
import DiscCheck from "../DiscCheck";
import { useUser } from "../../hooks/useUserContext";
import { CheckinsSearchForm } from "../../forms/Admin/CheckinsSearchForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "../../stylesheets/AllCheckins.css";
import PageButtons from "../PageButtons.jsx";

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
  const [checkins, setCheckins] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loadState, setLoadState] = useState("load");
  const [page, setPage] = useState(INIT_PAGE);
  const [modalState, setModalState] = useState(false);
  const [search, setSearch] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState();

  useEffect(() => {
    if (localStorage.getItem("token") == null) navigate("/home");
  }, []);
  useEffect(() => {
    if (user && !user?.isAdmin) {
      navigate("/home");
    }
  }, [user]);

  useEffect(() => {
    fetchCheckins();
  }, [user, page]);
  const fetchCheckins = async () => {
    const result = await DiscTrackerAPI.getAllCheckins(
      page,
      NUM_ITEMS_PER_PAGE,
      formData
    );
    setCheckins(result);
    setLoadState("ready");
  };
  if (loadState !== "ready") {
    return <div>Loading..</div>;
  }

  const incrementPage = () => {
    if (page < checkins.endPage) setPage(page + 1);
  };
  const decrementPage = () => {
    if (page > 1) setPage(page - 1);
  };

  let isPrev = checkins.previous ? false : true;
  let isNext = checkins.next ? false : true;

  return (
    <div className="AllCheckins">
      <h2>All Check Ins</h2>
      <div className="search-subtitle">
        <span id="search-btn" onClick={() => setSearch(s => !s)}>
          <span className="chevrons">
            <FontAwesomeIcon icon={search ? faChevronUp : faChevronDown} />
            <FontAwesomeIcon icon={search ? faChevronUp : faChevronDown} />
          </span>
          <p>Search</p>
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
      <PageButtons
        page={page}
        decrementPage={decrementPage}
        incrementPage={incrementPage}
        paginated={checkins.results}
        next={checkins.next}
        endPage={checkins.endPage}
        previous={checkins.previous}
      />
      <ul>
        {checkins.results.map(checkin => (
          <li key={checkin.id}>
            <DiscCheck
              user={user}
              checkin={checkin}
              modalState={modalState}
              setModalState={setModalState}
              fetchCheckins={fetchCheckins}
              setSelectedCheckin={setSelectedCheckin}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllCheckins;
