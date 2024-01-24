import React, { useState, useRef, useEffect } from "react";
import ReactAvatarEditor from "react-avatar-editor";
import defaultUserImg from "../assets/user-images/defaultprofilepic.png";
import { useUser } from "../hooks/useUserContext";
import "../stylesheets/AvatarUploader.css";
import Modal from "./modals/Modal";
import { SuccessModal } from "./modals/Content/SuccessModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassMinus } from "@fortawesome/free-solid-svg-icons";
import { getPublicIdFromUrl, uploadImage } from "../helpers/cloudinary";
import DiscTrackerAPI from "../api";
import { Link } from "react-router-dom";

//REFERENCE MATERIAL: https://kroonmackenzie.medium.com/allowing-users-to-upload-images-in-your-react-app-1d0d7cecb934
// DOCS https://github.com/mosch/react-avatar-editor

// vznudtlg

function AvatarUploader() {
  const { user, setUser } = useUser();
  const initialOptions = {
    image: defaultUserImg,
    allowZoomOut: false,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 50,
    preview: null,
    width: 320,
    height: 320,
  };
  const [options, setOptions] = useState(initialOptions);
  const [errorModalState, setErrorModalState] = useState(false);
  const [successModalState, setSuccessModalState] = useState(false);
  const [editable, setEditable] = useState(false);
  const editorRef = useRef();

  useEffect(() => {
    if (user) {
      setOptions({
        ...initialOptions,
        image: user.imgUrl ? user.imgUrl : defaultUserImg,
      });
    }
  }, [user]);

  const handleNewImage = e => {
    if (!e.target.files) return;
    if (!e.target.files[0]["type"].includes("image")) {
      setErrorModalState(true);
    } else {
      setEditable(true);
      setOptions(o => ({ ...o, image: e.target.files[0] }));
    }
  };
  const handleScale = e => {
    const scale = parseFloat(e.target.value);
    setOptions(o => ({ ...o, scale }));
  };
  const handlePositionChange = position => {
    setOptions(o => ({ ...o, position }));
  };

  const handleSubmit = async e => {
    if (editorRef.current) {
      const img = editorRef.current
        .getImageScaledToCanvas()
        .toDataURL("image/png");

      try {
        if (user.imgUrl) {
          const id = getPublicIdFromUrl(user.imgUrl);
          await DiscTrackerAPI.deleteStoredImage(id, user.username);
        }
        const url = await uploadImage(img);
        const updatedUser = await DiscTrackerAPI.updateUserImg(
          user.username,
          url
        );

        setUser(updatedUser);
        setSuccessModalState(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!user || !options) {
    return null;
  }

  return (
    <div className="AvatarUploader">
      <h2>Upload Profile Picture</h2>
      <label id="upload-img-input">
        Choose Photo
        <input name="upload-img-input" type="file" onChange={handleNewImage} />
      </label>

      <div>
        <ReactAvatarEditor
          ref={editorRef}
          scale={parseFloat(options.scale)}
          width={options.width}
          height={options.height}
          position={options.position}
          onPositionChange={handlePositionChange}
          rotate={parseFloat(options.rotate)}
          borderRadius={options.width / (100 / options.borderRadius)}
          image={options.image}
          color={[255, 255, 255, 1]}
          className="editor-canvas"
        />
      </div>
      <div className="zoom">
        <FontAwesomeIcon className="zoom-btn" icon={faMagnifyingGlassMinus} />
        <input
          id="zoom-slider"
          name="scale"
          type="range"
          onChange={handleScale}
          min={options.allowZoomOut ? "0.1" : "1"}
          max="2"
          step="0.01"
          defaultValue="1"
          disabled={!editable}
        />
        <FontAwesomeIcon className="zoom-btn" icon={faMagnifyingGlassPlus} />
      </div>

      <div>
        <div className="submit-buttons-container">
          <Link to={`/myaccount`}>
            <button>Cancel</button>
          </Link>
          <button onClick={handleSubmit} disabled={!editable}>
            Submit
          </button>
        </div>
      </div>
      <Modal setModalState={setErrorModalState} modalState={errorModalState}>
        <SuccessModal
          modalMessage={`Photo must be an image.`}
          modalTitle={"Error!"}
        />
      </Modal>
      <Modal
        setModalState={setSuccessModalState}
        modalState={successModalState}
        navTo={"/myaccount"}
      >
        <SuccessModal
          modalMessage={`Success`}
          modalTitle={"Image uploaded successfully!"}
        />
      </Modal>
    </div>
  );
}

export default AvatarUploader;
