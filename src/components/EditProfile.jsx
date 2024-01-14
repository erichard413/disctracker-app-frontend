import React, { useEffect } from "react";
import EditProfileForm from "../forms/EditProfileForm";
import { useUser } from "../hooks/useUserContext";
import { useAuth } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const { user } = useUser();
  const { currentToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentToken && !user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="EditProfile">
      <h2>Edit your Profile</h2>
      <EditProfileForm />
    </div>
  );
}

export default EditProfile;
