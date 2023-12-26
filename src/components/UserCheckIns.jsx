import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../api";
import DiscCheck from "./DiscCheck";
import { useUser } from "../hooks/useUserContext";
import { useAuth } from "../hooks/useAuthContext";
import "../stylesheets/UserCheckIns.css";

const INIT_PAGE = 1;
const NUM_PAGE_ITEMS = 4;

function UserCheckIns() {
  const { currentToken } = useAuth();
  const { user } = useUser();
  const [page, setPage] = useState(INIT_PAGE);
  const [loadState, setLoadState] = useState(true);
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState();

  useEffect(() => {
    if (!currentToken) {
      navigate("/", { replace: true });
      return;
    }
  }, []);

  useEffect(() => {
    setLoadState(true);
    async function fetchCheckins() {
      const res = await DiscTrackerAPI.getUserCheckins(
        user.username,
        page,
        NUM_PAGE_ITEMS,
        "DESC"
      );
      setCheckins(res);
    }
    if (user && page) fetchCheckins();
    setLoadState(false);
  }, [user, page]);

  if (loadState) return <p>Loading..</p>;

  const incrementPage = () => {
    if (page < checkins.endPage) setPage(p => p + 1);
  };
  const decrementPage = () => {
    if (page > 1) setPage(p => p - 1);
  };
  console.log(checkins);
  return (
    <div className="UserCheckIns">
      <h2>Check Ins for {user?.username}</h2>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <div className="button-container">
        <button onClick={decrementPage} disabled={page == INIT_PAGE}>
          prev
        </button>
        <p>Page {page}</p>
        <button onClick={incrementPage} disabled={checkins?.endPage == page}>
          next
        </button>
      </div>
      <div className="checkins-container">
        {checkins &&
          checkins.results.map(checkin => (
            <DiscCheck key={checkin.id} checkin={checkin} />
          ))}
      </div>
    </div>
  );
}

export default UserCheckIns;
