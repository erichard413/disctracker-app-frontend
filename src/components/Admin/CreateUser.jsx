import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminCreateUserForm from "../../forms/Admin/AdminCreateUserForm";
import { useUser } from "../../hooks/useUserContext";
import "../../stylesheets/Admin/CreateUser.css";

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
    <div className="CreateUser">
      <h2>Create User</h2>
      <AdminCreateUserForm />
    </div>
  );
}

export default CreateUser;
