import React, { useState, useEffect } from 'react'
import {Route, Routes, useNavigate, Navigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import DiscTrackerAPI from './api';
import Home from './components/Home';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Checkin from './components/Checkin';
import Checkins from './components/Checkins';
import Account from './components/Account';
import Disc from './components/Disc';
import EditProfile from './components/EditProfile';
import EditCheckin from './components/EditCheckin';
import AuthRecovery from './components/AuthRecovery';
import UserCheckIns from './components/UserCheckIns';
import AllUsers from './components/Admin/AllUsers';
import AdminPage from './components/Admin/AdminPage';
import UserPanel from './components/Admin/UserPanel';
import AdminEditUser from './components/Admin/AdminEditUser';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [discs, setDiscs] = useState();
  const [accounts, setAccounts] = useState();
  const [account, setAccount] = useState();

  // grab token from LS on page load, grab user on page load
  useEffect(()=>{
    async function getTokenFromLS() {
      let token = localStorage.getItem('token') || null;
      if (token) {
        DiscTrackerAPI.token = token;
      }
    }
    getTokenFromLS();
    
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
  }, [])
  // get user data on login
  useEffect(()=>{
    async function getUserData() {
        let data = jwt_decode(DiscTrackerAPI.token);
        let userData = await DiscTrackerAPI.getUser(data.username);
        setUser(userData);
    }
    
    if (DiscTrackerAPI.token) {
      getUserData();
    }
  },[DiscTrackerAPI])

  // function to log in user, store token on DiscTrackerAPI
  const logInUser = async(username, password) => {
    try {
      const res = await DiscTrackerAPI.logIn(username, password);
      localStorage.setItem('token', res.token);
      DiscTrackerAPI.token = res.token;
      let data = jwt_decode(DiscTrackerAPI.token);
      async function getData() {
        let userData = await DiscTrackerAPI.getUser(data.username);
        setUser(userData);
        navigate('/home')
        return res;
      }
      return getData();
    } catch (err) {
      return err;
    }
  }
  // function to log out user
  const logOutUser = () => {
    setUser();
    localStorage.removeItem('token')
    DiscTrackerAPI.token = null;
  }

  return (
    <div className="App">
      <NavBar logOut={logOutUser} user={user}/>
      <Routes>
        <Route exact path="/" element={<Home user={user} />} />
        <Route exact path="/home" element={<Home user={user} />} />
        <Route exact path="/login" element={<Login login={logInUser}/>} />
        <Route exact path="/register" element={<Register setUser={setUser}/>} />
        <Route exact path="/checkin/:discId" element={<Checkin user={user}/>} />
        <Route exact path="/checkins" element={<Checkins discs={discs} />} />
        <Route exact path="/discs/:discId" element={<Disc discs={discs} user={user} />} />
        <Route exact path="/myaccount" element={<Account user={user} />} />
        <Route exact path="/editprofile" element={<EditProfile user={user} setUser={setUser} />} />
        <Route exact path="/resetpw" element={<AuthRecovery />} />
        <Route exact path="/myaccount/checkins" element={<UserCheckIns user={user} />} />
        <Route exact path="/checkins/:id/edit" element={<EditCheckin user={user} />} />
        <Route exact path="/admin" element={<AdminPage user={user} />} />
        <Route exact path="/admin/users" element={<AllUsers user={user} setAccounts={setAccounts} accounts={accounts} setAccount={setAccount} />} />
        <Route exact path="/admin/users/:username" element={<UserPanel user={user} account={account} setAccount={setAccount} />} />
        <Route exact path="/admin/users/edit/:username" element={<AdminEditUser user={user} account={account} setAccount={setAccount}/>} />
      </Routes>
    </div>
  )
}

export default App
