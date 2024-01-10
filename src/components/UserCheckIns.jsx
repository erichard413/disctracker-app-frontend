import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../api";
import DiscCheck from "./DiscCheck";
import { useUser } from "../hooks/useUserContext";
import { useAuth } from "../hooks/useAuthContext";
import "../stylesheets/UserCheckIns.css";
import PageButtons from "./PageButtons";

const INIT_PAGE = 1;
const NUM_PAGE_ITEMS = 5;

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
    if (user) {
      setLoadState(true);
      fetchCheckins(INIT_PAGE);
      setLoadState(false);
    }
  }, [user]);

  async function fetchCheckins(idx = INIT_PAGE) {
    const checkinRes = await DiscTrackerAPI.getUserCheckins(
      user.username,
      idx,
      NUM_PAGE_ITEMS
    );
    setCheckins(checkinRes);
  }

  if (loadState || !checkins) return <p>Loading..</p>;

  const incrementPage = () => {
    fetchCheckins(page + 1);
    if (page < checkins.endPage) setPage(p => p + 1);
  };
  const decrementPage = () => {
    fetchCheckins(page - 1);
    if (page > 1) setPage(p => p - 1);
  };
  console.log(checkins);
  return (
    <div className="UserCheckIns">
      <h2>Check Ins for {user?.username}</h2>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <PageButtons
        page={page}
        decrementPage={decrementPage}
        incrementPage={incrementPage}
        paginated={checkins}
      />
      <div className="checkins-container">
        {checkins &&
          checkins.results.map(checkin => (
            <DiscCheck key={checkin.id} checkin={checkin} />
          ))}
        {checkins?.results.length == 0 && (
          <p>You have not checked in any discs yet!</p>
        )}
      </div>
    </div>
  );
}

export default UserCheckIns;
