import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../api";
import "../stylesheets/CheckinForm.css";
import { states, countryList, canadaProvinces } from "../helpers/data";
import Modal from "../components/modals/Modal";
import { SuccessModal } from "../components/modals/Content/SuccessModal";

import { Button, Form, FormGroup, Input, Label } from "reactstrap";

function EditCheckinForm({ user, checkin }) {
  const navigate = useNavigate();
  const initialFlash = "";
  const initialState = {
    courseName: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  };
  const [flashMsg, setFlashMsg] = useState(initialFlash);
  const [formData, setFormData] = useState(initialState);
  const [modalState, setModalState] = useState(false);
  const [fetchState, setFetchState] = useState("fetch");
  const [courseSuggestions, setCourseSuggestions] = useState([]);

  useEffect(() => {
    setFormData({
      courseName: checkin.courseName,
      city: checkin.city,
      state: checkin.state,
      zip: checkin.zip,
      country: checkin.country || "United States",
    });
  }, [checkin]);

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
    setFormData(data => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    async function handleCheckIn() {
      const res = await DiscTrackerAPI.editCheckin(checkin.id, formData);
      setFormData(formData);
    }
    try {
      handleCheckIn();
      setModalState(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuggestionClick = course => {
    setFetchState("clicked");
    setFormData(course);
    setCourseSuggestions([]);
  };

  if (!checkin || !formData) {
    return (
      <div>
        <p>Loading..</p>
      </div>
    );
  }

  // returns false if form not complete, true when form is completed
  const isComplete = () => {
    let res;
    // if any fields empty, return false
    Object.values(formData).map(data => (data === "" ? (res = false) : null));
    if (res === false) {
      return false;
    }
    // does data fit length requirements?
    if (formData.courseName.length < 2 || formData.courseName.length > 100) {
      return false;
    }
    if (formData.city.length < 1 || formData.city.length > 50) {
      return false;
    }
    if (formData.zip.length < 5 || formData.zip.length > 15) {
      return false;
    }
    return true;
  };

  return (
    <div className="CheckinForm">
      <div className="text-content">
        <h2>Edit Check-in</h2>
        <p>
          Fill out the form below as completely as possible. You may find your
          course while typing the course name, click on desired course to
          auto-fill this form.
        </p>
      </div>
      <div id="flash-container">
        <p className="FlashMsg">{flashMsg}</p>
      </div>

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
        {formData.courseName &&
          formData.courseName.length > 1 &&
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
            inputmode="numeric"
            autoComplete="off"
            placeholder="Zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </FormGroup>
        {isComplete() ? (
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button type="submit" onClick={handleSubmit} disabled>
            Submit
          </Button>
        )}
      </Form>
      <Modal
        setModalState={setModalState}
        modalState={modalState}
        navTo={`/checkins`}
      >
        <SuccessModal
          modalTitle={"Check-in updated!"}
          modalMessage={`Successfully edited check-in at ${formData.courseName}`}
        />
      </Modal>
    </div>
  );
}

export default EditCheckinForm;
