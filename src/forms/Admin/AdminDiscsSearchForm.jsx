import { useState } from "react";
import DiscTrackerAPI from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useDiscs } from "../../hooks/useDiscContext";
import { paginatedResults } from "../../helpers/paginatedResults";

const INIT_PAGE = 1;
const NUM_ITEMS_PER_PAGE = 10;
const initialFormData = {
  id: "",
  manufacturer: "",
  plastic: "",
  name: "",
};

export function AdminDiscsSearchForm({ setCurrentDiscs }) {
  const { discs, setDiscs } = useDiscs();
  const [expandedSearch, setExpandedSearch] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleSearch = async e => {
    const result = await DiscTrackerAPI.getDiscs(
      INIT_PAGE,
      NUM_ITEMS_PER_PAGE,
      formData
    );
    console.log(result);
    setCurrentDiscs(result);
  };
  const handleReset = async () => {
    setCurrentDiscs(paginatedResults(discs, INIT_PAGE, NUM_ITEMS_PER_PAGE));
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
      <label htmlFor="id">Disc Id:</label>
      <input
        type="numeric"
        name="id"
        placeholder="Disc Id#"
        onChange={handleChange}
        value={formData.id}
      />
      {expandedSearch && (
        <>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Disc Name"
            onChange={handleChange}
            value={formData.name}
          />
          <label htmlFor="manufacturer">Manufacturer:</label>
          <input
            type="text"
            name="Manufacturer"
            placeholder="Manufacturer"
            onChange={handleChange}
            value={formData.manufacturer}
          />
          <label htmlFor="userName">Plastic:</label>
          <input
            type="text"
            name="plastic"
            placeholder="Plastic"
            onChange={handleChange}
            value={formData.plastic}
          />
        </>
      )}

      <div className="search-buttons">
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => setExpandedSearch(search => !search)}>
          <span className="chevrons">
            <FontAwesomeIcon
              icon={expandedSearch ? faChevronUp : faChevronDown}
            />
            <FontAwesomeIcon
              icon={expandedSearch ? faChevronUp : faChevronDown}
            />
          </span>
        </button>
      </div>
    </div>
  );
}
