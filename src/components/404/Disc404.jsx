import { useNavigate } from "react-router-dom";
import "../../stylesheets/404/Disc404.css";

export function Disc404({ error }) {
  const navigate = useNavigate();
  return (
    <div className="Disc404">
      <h2>404 - Disc Not Found</h2>
      <p>Keep your drives on the fairway, bud!</p>
      <p>{error}.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
}
