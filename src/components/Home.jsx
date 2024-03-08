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
      <video autoPlay={true} muted playsInline loop id="video-home">
        <source src={video} type="video/mp4" />
      </video>
      <div className="about-content">
        <p>
          Every disc golfer knows the pain of losing a disc. Hopefully you had
          your name and number on the disc in the hopes that whoever finds it
          decides to return it. Far too often, the finder decides to hold on to
          the disc and ends up losing it. This results in getting a text about a
          disc you've lost months ago from someone who had found it on a course
          you've never played in a state that you've never been to!
        </p>
        <p>
          At least this has been my experience, which has piqued my curiousity.
          <span className="bold-me"> How far can a disc can travel?</span>
        </p>
      </div>
    </div>
  );
}

export default Home;
