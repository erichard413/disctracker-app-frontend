import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminEditUserForm from "../../forms/Admin/AdminEditUserForm";
import DiscTrackerAPI from "../../api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUserContext";

function AdminEditUser({ account, setAccount }) {
  const { user } = useUser();
  const { username } = useParams();
  const navigate = useNavigate();
  const [loadState, setLoadState] = useState("load");

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    setLoadState("done");
  }, [account]);

  useEffect(() => {
    if (loadState === "done" && !account) {
      console.log("no account - fetch data");
      async function fetchAccount() {
        const res = await DiscTrackerAPI.getUser(username);
        setAccount(res);
      }
      fetchAccount();
    }
  }, [loadState]);

  if (loadState === "load") {
    return <p>Loading..</p>;
  }

  if (user && !user.isAdmin) navigate("/home");

  return (
    <div className="AdminEditUser">
      {account && (
        <>
          <h3>Edit Profile for {account.username}</h3>
          <AdminEditUserForm account={account} user={user} />
        </>
      )}
    </div>
  );
}

export default AdminEditUser;
