import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUserContext";
import "../../stylesheets/Admin/AdminPage.css";

function AdminPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/", { replace: true });
      return;
    }
  }, []);

  if (!user) return <></>;

  return (
    <div className="AdminPage">
      <h2>Administration Panel</h2>
      <div className="Admin-links">
        <ul>
          <li>
            <Link to="/admin/users">
              <button type="button">Manage Users</button>
            </Link>
          </li>
          <li>
            <Link to="/admin/checkins">
              <button type="button">Manage Checkins</button>
            </Link>
          </li>
          <li>
            <Link to="/admin/discs">
              <button type="button">Manage Discs</button>
            </Link>
          </li>
          <li>
            <Link to="/admin/discs/create">
              <button type="button">Create Disc</button>
            </Link>
          </li>
          <li>
            <Link to="/admin/createuser">
              <button type="button">Create User</button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
