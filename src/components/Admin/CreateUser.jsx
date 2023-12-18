import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminCreateUserForm from "../../forms/Admin/AdminCreateUserForm";
import { useUser } from "../../hooks/useUserContext";

function CreateUser() {
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
      <h3>Create User</h3>
      <AdminCreateUserForm />
    </div>
  );
}

export default CreateUser;
