import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminCreateDiscForm from "../../forms/Admin/AdminCreateDiscForm";
import { useUser } from "../../hooks/useUserContext";

function CreateDisc() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/home");
      return;
    }
  }, []);

  if (user && !user.isAdmin) {
    navigate("/", { replace: true });
    return;
  }
  return (
    <div className="CreateDisc">
      <h2>Create disc</h2>
      <AdminCreateDiscForm user={user} />
    </div>
  );
}

export default CreateDisc;
