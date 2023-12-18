import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuthContext";
import { useUser } from "./hooks/useUserContext";
import { Footer } from "./components/Footer";
import jwt_decode from "jwt-decode";
import DiscTrackerAPI from "./api";
import Home from "./components/Home";
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
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [discs, setDiscs] = useState();
  const [accounts, setAccounts] = useState();
  const [account, setAccount] = useState();
  const { currentToken, setCurrentToken } = useAuth();
  const { user, setUser } = useUser();

  console.log(currentToken);

  // grab token from LS on page load, grab user on page load
  useEffect(() => {
    // -----SINCE I am using context, I probably don't need this code:

    // async function getTokenFromLS() {
    //   let token = localStorage.getItem("token") || null;
    //   if (token) {
    //     DiscTrackerAPI.token = token;
    //   }
    // }
    // getTokenFromLS();

    async function getUserData() {
      let data = jwt_decode(DiscTrackerAPI.token);
      let userData = await DiscTrackerAPI.getUser(data.username);
      setUser(userData);
    }
    async function getDiscData() {
      let discs = await DiscTrackerAPI.getAllDiscs();
      setDiscs(discs);
    }
    getDiscData();
    if (DiscTrackerAPI.token) {
      getUserData();
    }
  }, []);
  // get user data on login
  useEffect(() => {
    async function getUserData() {
      let data = jwt_decode(DiscTrackerAPI.token);
      let userData = await DiscTrackerAPI.getUser(data.username);
      setUser(userData);
    }

    if (DiscTrackerAPI.token) {
      getUserData();
    }
  }, [DiscTrackerAPI]);

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
        navigate("/home");
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

  return (
    <div className="App">
      <NavBar logOut={logOutUser} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/login" element={<Login login={logInUser} />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/checkin/:discId" element={<Checkin />} />
        <Route exact path="/checkins" element={<Checkins discs={discs} />} />
        <Route exact path="/discs/:discId" element={<Disc discs={discs} />} />
        <Route exact path="/myaccount" element={<Account />} />
        <Route exact path="/editprofile" element={<EditProfile />} />
        <Route exact path="/resetpw" element={<AuthRecovery />} />
        <Route exact path="/myaccount/checkins" element={<UserCheckIns />} />
        <Route exact path="/checkins/:id/edit" element={<EditCheckin />} />
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
        <Route exact path="/admin/discs/create" element={<CreateDisc />} />
      </Routes>
    </div>
  );
}

export default App;
