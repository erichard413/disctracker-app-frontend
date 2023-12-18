import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../../api";
import { useUser } from "../../hooks/useUserContext";

function AdminCreateDiscForm() {
  const { user } = useUser();
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

  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData);
    async function doCreate() {
      const result = await DiscTrackerAPI.createDisc(formData);
      if (result.Created)
        setFlashMsg({ ...flashMsg, message: `Disc created successfully!` });
      if (result.error) console.error(result);
      setTimeout(() => {
        setFlashMsg(initialFlash);
      }, 3500);
      return;
    }
    doCreate();
  };

  return (
    <div className="AdminCreateDiscForm">
      <p>{flashMsg && flashMsg.message}</p>
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
