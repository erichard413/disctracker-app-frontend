import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../api";
import "../stylesheets/CheckinForm.css";
import { states, countryList, canadaProvinces } from "../helpers/data";
import Modal from "../components/modals/Modal";

import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { SuccessModal } from "../components/modals/Content/SuccessModal";
import { useUser } from "../hooks/useUserContext";

function CheckinForm({ disc, openRegisterModal, openLogInModal }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const initialFlash = "";
  const initialState = {
    courseName: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    note: "",
  };
  const [modalState, setModalState] = useState(false);
  const [flashMsg, setFlashMsg] = useState(initialFlash);
  const [formData, setFormData] = useState(initialState);
  const [fetchState, setFetchState] = useState("fetch");
  const [courseSuggestions, setCourseSuggestions] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const courses = await DiscTrackerAPI.getCourses(formData.courseName);
      setCourseSuggestions(courses);
    }
    if (fetchState === "fetch") {
      fetchCourses();
    }
    setFetchState("fetch");
  }, [formData.courseName]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name == "note" && value.length == 255) {
      return;
    }
    setFormData(data => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    async function handleCheckIn() {
      await DiscTrackerAPI.doCheckIn(disc.id, formData);
    }
    handleCheckIn();
    setModalState(true);
  };

  const handleSuggestionClick = course => {
    setFetchState("clicked");
    setFormData(data => ({ ...data, ...course }));
    setCourseSuggestions([]);
  };

  // returns false if form not complete, true when form is completed
  const isComplete = () => {
    let res;
    // if any fields empty, return false
    // Object.values(formData).map(data => (data === "" ? (res = false) : null));
    // if (res === false) {
    //   return false;
    // }
    if (formData.courseName === "") return false;
    if (formData.country === "United States" || formData.country === "Canada") {
      if (formData.zip === "") return false;
      if (formData.zip.length < 5 || formData.zip.length > 15) {
        return false;
      }
      if (formData.state === "") return false;
    }

    if (formData.city === "") return false;
    // does data fit length requirements?
    if (formData.courseName.length < 2 || formData.courseName.length > 100) {
      return false;
    }
    if (formData.city.length < 1 || formData.city.length > 50) {
      return false;
    }

    if (formData.note?.length > 255) {
      return false;
    }
    return true;
  };

  const handleSignUpClick = e => {
    e.preventDefault();
    openRegisterModal();
  };
  const handleLogInClick = e => {
    e.preventDefault();
    openLogInModal();
  };

  return (
    <div className="CheckinForm">
      <p className="FlashMsg">{flashMsg}</p>
      <Form className="form">
        <FormGroup>
          <Label for="type">Course Name:</Label>
          <Input
            name="courseName"
            type="text"
            autoComplete="off"
            placeholder="Course Name"
            value={formData.courseName}
            onChange={handleChange}
          />
        </FormGroup>
        {formData.courseName.length > 1 &&
          document.activeElement.name === "courseName" && (
            <div className="CheckinForm-suggestions">
              {courseSuggestions.map(course => (
                <div
                  className="suggestion"
                  key={course.id}
                  onClick={() => handleSuggestionClick(course)}
                >
                  <p key={course.id}>{course.courseName}</p>
                </div>
              ))}
            </div>
          )}
        <FormGroup>
          <Label for="type">Country:</Label>
          <Input
            name="country"
            type="select"
            placeholder="Your country"
            value={formData.country}
            onChange={handleChange}
          >
            {countryList.map(country => (
              <option key={country}>{country}</option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="type">City:</Label>
          <Input
            name="city"
            type="text"
            autoComplete="off"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="state">
            {formData.country === "Canada" ? "Province" : "State"}:
          </Label>
          {formData.country === "United States" ? (
            <Input
              name="state"
              type="select"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            >
              {states.map(state => (
                <option key={state}>{state}</option>
              ))}
            </Input>
          ) : formData.country === "Canada" ? (
            <Input
              name="state"
              type="select"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            >
              {canadaProvinces.map(province => (
                <option key={province}>{province}</option>
              ))}
            </Input>
          ) : (
            <Input
              name="state"
              type="text"
              autoComplete="off"
              placeholder={
                formData.country === "Canada" ? "Province" : "State/Province"
              }
              value={formData.state}
              onChange={handleChange}
            />
          )}
        </FormGroup>
        <FormGroup>
          <Label for="type">Zip:</Label>
          <Input
            name="zip"
            type="text"
            autoComplete="off"
            placeholder="Zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </FormGroup>
        {user && (
          <FormGroup>
            <Label for="type">Note:</Label>
            <Input
              name="note"
              type="textarea"
              autoComplete="off"
              placeholder="Optional"
              maxLength="255"
              rows="5"
              value={formData.note}
              onChange={handleChange}
            />
          </FormGroup>
        )}

        <div className="buttons-container">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isComplete() ? false : true}
          >
            Submit
          </Button>
          {!user && <button onClick={handleSignUpClick}>Sign Up</button>}
          {!user && <button onClick={handleLogInClick}>Log In</button>}
        </div>

        <Modal
          setModalState={setModalState}
          modalState={modalState}
          navTo={`/discs/${disc.id}`}
        >
          <SuccessModal
            modalMessage={`You've successfully checked in this disc at ${formData.courseName}`}
            modalTitle={"Check in complete!"}
          />
        </Modal>
      </Form>
    </div>
  );
}

export default CheckinForm;
