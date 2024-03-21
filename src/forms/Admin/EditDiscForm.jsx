import { useNavigate, useParams } from "react-router-dom";
import { useDiscs } from "../../hooks/useDiscContext";
import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import DiscTrackerAPI from "../../api";
import Modal from "../../components/modals/Modal";
import { SuccessModal } from "../../components/modals/Content/SuccessModal";
import { FlashContainer } from "../../components/flash/FlashContainer";
import "../../stylesheets/EditDisc.css";
import { isValidImageUrl } from "../../helpers/isValidHttpUrl";

export function EditDiscForm() {
  const navigate = useNavigate();
  const { discId } = useParams();
  const { discs, setDiscs } = useDiscs();
  const [formData, setFormData] = useState(null);
  const [flashMsg, setFlashMsg] = useState(null);
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    if (discs) {
      let discData = discs.filter(d => d.id == discId)[0];
      const { name, plastic, manufacturer } = discData;
      setFormData({
        name,
        plastic,
        manufacturer,
        imgUrl: discData.imgUrl ? discData.imgUrl : "",
      });
    }
  }, [discs]);

  if (!formData)
    return (
      <div>
        <p>Loading..</p>
      </div>
    );
  const handleChange = e => {
    let { name, value } = e.target;

    const changeState = () => {
      setFormData(data => ({
        ...data,
        [name]: value,
      }));
    };
    if (name === "id" && value.length <= 20 && !window.isNaN(value)) {
      value = value.replace(/\s/g, "");
      changeState();
    }
    if (name === "manufacturer" && value.length <= 30) changeState();
    if (name === "plastic" && value.length <= 30) changeState();
    if (name === "name" && value.length <= 30) changeState();
    if (name === "imgUrl") changeState();
  };
  const handleSubmit = async e => {
    if (formData.imgUrl && !isValidImageUrl(formData.imgUrl)) {
      setFlashMsg({ Error: "Image Url must be a valid image url!" });
      setTimeout(() => {
        setFlashMsg(null);
      }, 3000);
      return;
    }

    try {
      await DiscTrackerAPI.editDisc(discId, {
        ...formData,
        imgUrl: formData.imgUrl === "" ? null : formData.imgUrl,
      });
      // update our state to reflect changes
      setDiscs(data =>
        data.map(d => {
          if (d.id == discId)
            return {
              id: discId,
              ...formData,
              imgUrl: formData.imgUrl === "" ? null : formData.imgUrl,
            };
          return d;
        })
      );
      setModalState(true);
    } catch (err) {
      setFlashMsg({ Error: err[0] });
      setTimeout(() => {
        setFlashMsg(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className="EditDiscForm">
        <FlashContainer flashMsg={flashMsg} />

        <Form className="form">
          <FormGroup>
            <Label for="id">Disc Id:</Label>
            <Input
              name="id"
              type="text"
              placeholder="Disc Id"
              value={discId}
              disabled
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
          <div className="button-container">
            <Button onClick={() => navigate("/checkins")}>Cancel</Button>
            <Button onClick={handleSubmit}>Edit</Button>
          </div>
        </Form>
      </div>
      <Modal
        modalState={modalState}
        setModalState={setModalState}
        navTo={`/discs/${discId}`}
      >
        <SuccessModal
          modalTitle={`Disc ${discId}!`}
          modalMessage={`Disc edited successfully!`}
        />
      </Modal>
    </>
  );
}
