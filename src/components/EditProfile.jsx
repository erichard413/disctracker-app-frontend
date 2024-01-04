import React from "react";
import EditProfileForm from "../forms/EditProfileForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUserContext";

function EditProfile() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) navigate("/");

  return (
    <div className="EditProfile">
      <h2>Edit your Profile</h2>
      <EditProfileForm />
    </div>
  );
}

export default EditProfile;
