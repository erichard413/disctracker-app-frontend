import React from "react";
import { useUser } from "../hooks/useUserContext";
import video from "../assets/video/discsvideo.mp4";
import "../stylesheets/Home.css";

function Home() {
  const { user } = useUser();

  return (
    <div className="Home">
      <h2>Welcome to the Traveling Disc Project</h2>
      {user && <p>Welcome back, {user.username}.</p>}
      <video autoPlay={true} muted loop id="video-home">
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
}

export default Home;
