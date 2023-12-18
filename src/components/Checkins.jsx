import React from "react";
import DiscCard from "./DiscCard";

function Checkins({ discs }) {
  return (
    <div className="Checkins">
      <h2>Select Disc</h2>
      {discs && discs.map(disc => <DiscCard key={disc.id} disc={disc} />)}
    </div>
  );
}

export default Checkins;
