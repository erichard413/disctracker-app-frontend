import { Link } from "react-router-dom";
import "../stylesheets/Footer.css";

export function Footer() {
  return (
    <div className="Footer">
      <p>
        2023 Designed & Operated by:{"   "}
        <Link to={"https://www.erikrichard.dev"}>Erik Richard</Link>
      </p>
    </div>
  );
}
