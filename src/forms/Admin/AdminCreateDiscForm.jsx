import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../../api";
import { useUser } from "../../hooks/useUserContext";
import { useDiscs } from "../../hooks/useDiscContext";
import "../../stylesheets/Admin/CreateDisc.css";
import Modal from "../../components/modals/Modal";
import { SuccessModal } from "../../components/modals/Content/SuccessModal";
import { isValidImageUrl } from "../../helpers/isValidHttpUrl";
import { isValid } from "date-fns";
import { FlashContainer } from "../../components/flash/FlashContainer";

function AdminCreateDiscForm() {
  const { user } = useUser();
  const { discs, setDiscs } = useDiscs();
  const [modalState, setModalState] = useState();

  let initialFlash = {};
  let initialForm = {
    id: "",
    manufacturer: "",
    plastic: "",
    name: "",
    imgUrl: "",
  };

  const [flashMsg, setFlashMsg] = useState(initialFlash);
  const [formData, setFormData] = useState(initialForm);

  const handleChange = e => {
    let { name, value } = e.target;
    const changeState = () => {
      setFormData(data => ({
        ...data,
        [name]: value,
      }));
    };
    if (name === "id" && value.length <= 20) changeState();
    if (name === "manufacturer" && value.length <= 30) changeState();
    if (name === "plastic" && value.length <= 30) changeState();
    if (name === "name" && value.length <= 30) changeState();
    if (name === "imgUrl") changeState();
  };

  if (!user) {
    return (
      <div>
        <p>Loading..</p>
      </div>
    );
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.imgUrl && !isValidImageUrl(formData.imgUrl)) {
      setFlashMsg({ Error: "Image Url must be a valid image url!" });
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 3000);
      return;
    }

    try {
      await DiscTrackerAPI.createDisc({
        ...formData,
        imgUrl: formData.imgUrl === "" ? null : formData.imgUrl,
      });
      setDiscs(data => [
        ...data,
        {
          ...formData,
          imgUrl: formData.imgUrl === "" ? null : formData.imgUrl,
        },
      ]);
      setModalState(true);
    } catch (err) {
      setFlashMsg({ Error: err[0] });
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 3000);
    }
  };

  return (
    <div className="AdminCreateDiscForm">
      <FlashContainer flashMsg={flashMsg} />

      <Form className="form">
        <FormGroup>
          <Label for="id">Disc Id:</Label>
          <Input
            name="id"
            type="text"
            placeholder="Disc Id"
            value={formData.id}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="manufacturer">Disc Manufacturer:</Label>
          <Input
            name="manufacturer"
            type="text"
            placeholder="Manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="plastic">Disc Plastic:</Label>
          <Input
            name="plastic"
            type="text"
            placeholder="Plastic"
            value={formData.plastic}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="name">Disc Name:</Label>
          <Input
            name="name"
            type="text"
            placeholder="Disc Name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="imgUrl">Image Url:</Label>
          <Input
            name="imgUrl"
            type="text"
            placeholder="http://"
            value={formData.imgUrl}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>Create</Button>
      </Form>
      <Modal
        setModalState={setModalState}
        modalState={modalState}
        navTo={`/admin`}
      >
        <SuccessModal
          modalMessage={`Successfully created Disc: ${formData.discId}`}
          modalTitle={"Disc created!"}
        />
      </Modal>
    </div>
  );
}

export default AdminCreateDiscForm;
