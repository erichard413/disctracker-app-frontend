import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuthContext";
import { useUser } from "./hooks/useUserContext";
import { EditDisc } from "./components/Admin/EditDisc";
import { useDiscs } from "./hooks/useDiscContext";
import jwt_decode from "jwt-decode";
import DiscTrackerAPI from "./api";
import Home from "./components/Home";
import UserPage from "./components/UserPage";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Register from "./components/Register";
import Checkin from "./components/Checkin";
import Checkins from "./components/Checkins";
import Account from "./components/Account";
import Disc from "./components/Disc";
import EditProfile from "./components/EditProfile";
import EditCheckin from "./components/EditCheckin";
import AuthRecovery from "./components/AuthRecovery";
import UserCheckIns from "./components/UserCheckIns";
import AllUsers from "./components/Admin/AllUsers";
import AdminPage from "./components/Admin/AdminPage";
import UserPanel from "./components/Admin/UserPanel";
import AdminEditUser from "./components/Admin/AdminEditUser";
import AllCheckins from "./components/Admin/AllCheckins";
import CreateDisc from "./components/Admin/CreateDisc";
import CreateUser from "./components/Admin/CreateUser";
import AllDiscs from "./components/Admin/AllDiscs";
import { About } from "./components/About";
import "./App.css";
import AvatarUploader from "./components/AvatarUploader";
import { Link } from "react-router-dom";
import wtfrichard from "./assets/error-image/wtfrichard.gif";
import { ManageAdmins } from "./components/Admin/ManageAdmins";

function App() {
  const navigate = useNavigate();
  const { discs, setDiscs } = useDiscs();
  const [accounts, setAccounts] = useState();
  const [account, setAccount] = useState();
  const { user, setUser } = useUser();

  // grab token from LS on page load, grab user on page load
  useEffect(() => {
    async function getDiscData() {
      let discs = await DiscTrackerAPI.getAllDiscs();
      setDiscs(discs);
    }
    getDiscData();
    if (DiscTrackerAPI.token) {
      getUserData();
    }
  }, []);

  async function getUserData() {
    try {
      let data = jwt_decode(DiscTrackerAPI.token);
      let userData = await DiscTrackerAPI.getUser(data.username);
      setUser(userData);
    } catch (err) {
      console.log(err);
      DiscTrackerAPI.token = null;
      localStorage.removeItem("token");
    }
  }

  // function to log in user, store token on DiscTrackerAPI
  const logInUser = async (username, password) => {
    try {
      const res = await DiscTrackerAPI.logIn(username, password);
      localStorage.setItem("token", res.token);
      DiscTrackerAPI.token = res.token;
      let data = jwt_decode(DiscTrackerAPI.token);
      async function getData() {
        let userData = await DiscTrackerAPI.getUser(data.username);
        setUser(userData);
        return res;
      }
      return getData();
    } catch (err) {
      return err;
    }
  };
  // function to log out user
  const logOutUser = () => {
    setUser();
    localStorage.removeItem("token");
    DiscTrackerAPI.token = null;
  };

  console.log(import.meta.env.VITE_REACT_APP_BASE_URL);

  return (
    <div className="App">
      <NavBar logOut={logOutUser} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/login" element={<Login doLogin={logInUser} />} />
        <Route
          exact
          path="/register"
          element={<Register doLogin={logInUser} />}
        />
        <Route
          exact
          path="/checkin/:discId"
          element={<Checkin doLogin={logInUser} />}
        />
        <Route exact path="/checkins" element={<Checkins />} />
        <Route exact path="/discs/:discId" element={<Disc />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/discs/:discId/edit" element={<EditDisc />} />
        <Route exact path="/myaccount" element={<Account />} />
        <Route exact path="/editprofile" element={<EditProfile />} />
        <Route exact path="/resetpw" element={<AuthRecovery />} />
        <Route exact path="/myaccount/checkins" element={<UserCheckIns />} />
        <Route exact path="/checkins/:id/edit" element={<EditCheckin />} />
        <Route exact path="/users/:username" element={<UserPage />} />
        <Route
          exact
          path="/users/:username/avatar"
          element={<AvatarUploader />}
        />
        <Route exact path="/admin" element={<AdminPage />} />
        <Route
          exact
          path="/admin/users"
          element={
            <AllUsers
              setAccounts={setAccounts}
              accounts={accounts}
              setAccount={setAccount}
            />
          }
        />
        <Route exact path="/admin/createuser" element={<CreateUser />} />
        <Route
          exact
          path="/admin/users/:username"
          element={<UserPanel account={account} setAccount={setAccount} />}
        />
        <Route
          exact
          path="/admin/users/edit/:username"
          element={<AdminEditUser account={account} setAccount={setAccount} />}
        />
        <Route exact path="/admin/checkins" element={<AllCheckins />} />
        <Route exact path="/admin/discs" element={<AllDiscs />} />
        <Route
          exact
          path="/admin/manageadmins"
          element={
            <ManageAdmins
              setAccounts={setAccounts}
              accounts={accounts}
              setAccount={setAccount}
            />
          }
        />
        <Route exact path="/admin/discs/create" element={<CreateDisc />} />
        <Route path="/*" element={<ErrorElement />} />
      </Routes>
    </div>
  );
}

function ErrorElement() {
  return (
    <div className="error-element">
      <h1>What the f%@$, Richard!</h1>
      <h3>404 - Fairway not found.</h3>
      <p>
        Return to <Link to={"/"}>home</Link>
      </p>
      <img src={wtfrichard} alt={"disc golf fail"} />
    </div>
  );
}

export default App;
