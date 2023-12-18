import React from "react";
import { useUser } from "../hooks/useUserContext";

function Home() {
  const { user } = useUser();
  return (
    <div className="Home">
      <h1>I AM THE HOME PAGE</h1>
      {user && <p>{user.username} is logged in.</p>}
    </div>
  );
}

export default Home;
