import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../../api";
import DeleteUserModal from "../modals/Content/DeleteUserModal";
import { useUser } from "../../hooks/useUserContext";
import "../../stylesheets/AllUsers.css";
import Modal from "../modals/Modal";
import PageButtons from "../PageButtons";

function AllUsers({ accounts, setAccounts, setAccount }) {
  const { user } = useUser();
  const initialForm = { username: "" };
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [flashMsg, setFlashMsg] = useState();
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!localStorage.getItem("token") && !user.isAdmin) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      const result = await DiscTrackerAPI.getUsers(page, 9);
      setAccounts({ ...result });
    };
    if (user && user.isAdmin) fetchAccounts();
  }, [user]);

  const fetchAccounts = async idx => {
    const result = await DiscTrackerAPI.getUsers(idx, 9, formData.username);
    setAccounts({ ...result });
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(data => ({
      ...data,
      [name]: value.replace(/\s/g, ""),
    }));
  };

  const incrementPage = () => {
    fetchAccounts(page + 1);
    if (page < accounts.endPage) setPage(page + 1);
  };
  const decrementPage = () => {
    fetchAccounts(page - 1);
    if (page > 1) setPage(page - 1);
  };

  const handleClick = acc => {
    async function doClick() {
      await setAccount(acc);
      navigate(`/admin/users/${acc.username}`);
    }
    doClick();
  };
  const handleDeleteClick = (e, username) => {
    e.preventDefault();
    const rootDiv = document.getElementById("root");
    if (modalState) {
      rootDiv.classList.remove("Modal-noScroll");
    } else {
      rootDiv.classList.add("Modal-noScroll");
    }
    setModalState(!modalState);
    setSelectedUser(username);
  };

  const doDelete = async () => {
    const res = await DiscTrackerAPI.adminDeleteUser(selectedUser);
    const rootDiv = document.getElementById("root");
    if (modalState) {
      rootDiv.classList.remove("Modal-noScroll");
    } else {
      rootDiv.classList.add("Modal-noScroll");
    }
    setModalState(!modalState);
    let updateAccList = accounts.results.filter(
      acc => acc.username.toLowerCase() !== selectedUser.toLowerCase()
    );
    setAccounts({ ...accounts, results: updateAccList });
    setFlashMsg(res);
    setTimeout(() => {
      setFlashMsg();
    }, 3000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    //get new data from DB
    async function fetchUsers() {
      const result = await DiscTrackerAPI.getUsers(1, 9, formData.username);
      setAccounts({ ...result });
    }
    fetchUsers();
    setPage(1);
  };

  const handleReset = e => {
    e.preventDefault();
    setFormData(initialForm);
    const fetchAccounts = async () => {
      const result = await DiscTrackerAPI.getUsers(page);
      setAccounts({ ...result });
    };
    if (user && user.isAdmin) fetchAccounts();
  };

  return (
    <div className="AdminUsers">
      <h2>User Management</h2>
      <p id="flash-container">{flashMsg}</p>
      <div className="AdminUsers-users-container">
        <label htmlFor="username">Search by Username:</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
        />
        <div className="search-buttons">
          <button onClick={handleSubmit}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div className="hr-line-grey"></div>
        <div className="hr-line-teal"></div>

        <PageButtons
          page={page}
          decrementPage={decrementPage}
          incrementPage={incrementPage}
          paginated={accounts}
        />
        <div className="accounts-container">
          <ul>
            {accounts &&
              accounts.results.map(acc => (
                <UserListItem
                  key={acc.username}
                  handleDeleteClick={handleDeleteClick}
                  handleClick={handleClick}
                  acc={acc}
                />
              ))}
          </ul>
        </div>

        <Modal
          modalState={modalState}
          setModalState={setModalState}
          navTo={"/admin/users"}
        >
          <DeleteUserModal username={selectedUser} doDelete={doDelete} />
        </Modal>
      </div>
    </div>
  );
}

function UserListItem({ acc, handleDeleteClick, handleClick }) {
  return (
    <li key={acc.username}>
      <div className="li-container-left">{acc.username}</div>
      <div className="li-container-right">
        <button
          className="user-delete-btn"
          disabled={acc.isAdmin ? true : false}
          onClick={e => handleDeleteClick(e, acc.username)}
        >
          DELETE
        </button>
        <button className="user-delete-btn" onClick={() => handleClick(acc)}>
          VIEW
        </button>
      </div>
    </li>
  );
}

export default AllUsers;
