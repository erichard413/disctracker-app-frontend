import { useState } from "react";
import DiscTrackerAPI from "../../api";

const INIT_PAGE = 1;
const NUM_ITEMS_PER_PAGE = 5;
const initialFormData = {
  userName: "",
  courseName: "",
  date: "",
};

export function CheckinsSearchForm({
  setCheckins,
  page,
  formData,
  setFormData,
}) {
  const handleSearch = async e => {
    if (
      formData.userName == "" &&
      formData.date == "" &&
      formData.courseName == ""
    )
      return;

    const result = await DiscTrackerAPI.getAllCheckins(
      INIT_PAGE,
      NUM_ITEMS_PER_PAGE,
      formData
    );
    setCheckins(result);
  };
  const handleReset = async () => {
    const result = await DiscTrackerAPI.getAllCheckins(
      page,
      NUM_ITEMS_PER_PAGE
    );
    setCheckins(result);
    setFormData(initialFormData);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newVal = value;
    if (name == "userName") newVal = value.replace(/\s/g, "");
    setFormData(data => ({ ...data, [name]: newVal }));
  };

  return (
    <div className="search-container">
      <label htmlFor="userName">Username:</label>
      <input
        type="text"
        name="userName"
        placeholder="Username"
        onChange={handleChange}
        value={formData.userName}
      />
      <label htmlFor="userName">Course:</label>
      <input
        type="text"
        name="courseName"
        placeholder="Course Name"
        onChange={handleChange}
        value={formData.courseName}
      />
      <label htmlFor="userName">Date:</label>
      <input
        id="date-input"
        type="date"
        name="date"
        placeholder="Date"
        onChange={handleChange}
        value={formData.date}
      />
      <div className="search-buttons">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}
