import React, { useState, useEffect } from 'react'
import {Route, Routes, useNavigate, Navigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import DiscTrackerAPI from './api';
import Home from './components/Home';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Checkin from './components/Checkin';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

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
      </Routes>
    </div>
  )
}

export default App
