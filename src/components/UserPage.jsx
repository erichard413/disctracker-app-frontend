import { useEffect, useState } from "react";
import { UNSAFE_NavigationContext, useParams } from "react-router-dom";
import DiscTrackerAPI from "../api";
import defaultUserImg from "../assets/user-images/defaultprofilepic.png";
import "../stylesheets/UserPage.css";
import DiscCheck from "./DiscCheck";
import PageButtons from "./PageButtons";
import { useNavigate } from "react-router-dom";

const INIT_PAGE = 1;
const INIT_LIMIT = 5;

function UserPage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [fetchedUser, setFetchedUser] = useState(null);
  const [fetchedCheckins, setFetchedCheckins] = useState([]);
  const [loadState, setLoadState] = useState("load");
  const [page, setPage] = useState(INIT_PAGE);
  useEffect(() => {
    async function FetchUserData() {
      try {
        const userRes = await DiscTrackerAPI.getUser(username);
        if (!userRes.username) throw Error;
        setFetchedUser(userRes);
        fetchCheckins();
        setLoadState("ready");
      } catch (err) {
        navigate("/404");
      }
    }
    FetchUserData();
  }, [username]);

  async function fetchCheckins(idx = INIT_PAGE) {
    const checkinRes = await DiscTrackerAPI.getUserCheckins(
      username,
      idx,
      INIT_LIMIT
    );
    setFetchedCheckins(checkinRes);
  }

  if (loadState != "ready") return;

  const dateStrings = fetchedUser?.joinDate?.split(" ")[0].split("-");

  const incrementPage = () => {
    setLoadState("fetching-checkins");
    if (page < fetchedCheckins.endPage) setPage(p => p + 1);
    fetchCheckins(page + 1);
  };
  const decrementPage = () => {
    setLoadState("fetching-checkins");
    if (page > 1) setPage(p => p - 1);
    fetchCheckins(page - 1);
  };
  return (
    <div className="UserPage">
      <h2>{fetchedUser?.username}</h2>
      <div className="top-container">
        <div className="left-container">
          <img
            id="avatar-pic"
            src={fetchedUser?.imgUrl ? fetchedUser.imgUrl : defaultUserImg}
            alt="default-profile-pic"
          />
        </div>
        <div className="right-container">
          <ul>
            <li>First Name: {fetchedUser?.firstName}</li>
            <li>Last Name: {fetchedUser?.lastName}</li>
            {dateStrings && (
              <li>
                Joined:{" "}
                {dateStrings[1] + "-" + dateStrings[2] + "-" + dateStrings[0]}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>
      <div className="checkin-container">
        <h3>{fetchedUser.username}'s check ins:</h3>
        {fetchedCheckins.results?.map(checkin => (
          <DiscCheck
            key={checkin.id}
            checkin={checkin}
            fetchCheckins={fetchCheckins}
          />
        ))}
        <PageButtons
          page={page}
          decrementPage={decrementPage}
          incrementPage={incrementPage}
          paginated={fetchedCheckins.results}
          next={fetchedCheckins.next}
          endPage={fetchedCheckins.endPage}
          previous={fetchedCheckins.previous}
        />
      </div>
    </div>
  );
}

export default UserPage;
