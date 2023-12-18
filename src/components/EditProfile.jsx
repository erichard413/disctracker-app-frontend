import React, { useEffect } from "react";
import EditProfileForm from "../forms/EditProfileForm";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="EditProfile">
      <h3>Edit your Profile</h3>
      <EditProfileForm />
    </div>
  );
}

export default EditProfile;
