import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../../api";
import { useUser } from "../../hooks/useUserContext";
import { useDiscs } from "../../hooks/useDiscContext";
import "../../stylesheets/Admin/CreateDisc.css";

function AdminCreateDiscForm() {
  const { user } = useUser();
  const { discs, setDiscs } = useDiscs();
  let errs = {};
  let initialFlash = {};
  let initialForm = {
    id: "",
    manufacturer: "",
    plastic: "",
    name: "",
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
    try {
      await DiscTrackerAPI.createDisc(formData);
      setDiscs(data => [...data, { ...formData }]);
    } catch (err) {
      setFlashMsg({ message: err[0] });
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 3500);
    }
  };

  return (
    <div className="AdminCreateDiscForm">
      <div id="flash-container">
        <p>{flashMsg && flashMsg.message}</p>
      </div>

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
        <Button onClick={handleSubmit}>Create</Button>
      </Form>
    </div>
  );
}

export default AdminCreateDiscForm;
