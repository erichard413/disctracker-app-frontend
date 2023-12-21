import React from "react";
import DiscCard from "./DiscCard";
import { useDiscs } from "../hooks/useDiscContext";

function Checkins() {
  const { discs } = useDiscs();
  console.log(discs);
  return (
    <div className="Checkins">
      <h2>Select Disc</h2>
      {discs && discs.map(disc => <DiscCard key={disc.id} disc={disc} />)}
    </div>
  );
}

export default Checkins;
