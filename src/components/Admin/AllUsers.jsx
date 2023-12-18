import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscTrackerAPI from "../../api";
import DeleteUserModal from "./modals/DeleteUserModal";
import { useUser } from "../../hooks/useUserContext";

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
    if (localStorage.getItem("token") == null) {
      navigate("/home");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      const result = await DiscTrackerAPI.getUsers(page);
      const userList = result.results.filter(
        acc =>
          acc.username.toLowerCase() !== user.username.toLowerCase() &&
          acc.isAdmin === false
      );
      setAccounts({ ...result, results: userList });
    };
    if (user && user.isAdmin) fetchAccounts();
  }, [user, page]);

  if (user && !user.isAdmin) {
    navigate("/", { replace: true });
    return;
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(data => ({
      ...data,
      [name]: value,
    }));
  };

  const incrementPage = () => {
    if (page < accounts.endPage) setPage(page + 1);
  };
  const decrementPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleClick = acc => {
    async function doClick() {
      await setAccount(acc);
      navigate(`/admin/users/${acc.username}`);
    }
    doClick();
  };

  const handleDeleteClick = e => {
    e.preventDefault();
    const rootDiv = document.getElementById("root");
    if (modalState) {
      rootDiv.classList.remove("Modal-noScroll");
    } else {
      rootDiv.classList.add("Modal-noScroll");
    }
    setModalState(!modalState);
    setSelectedUser(e.target.closest("li").innerText.slice(0, -2));
  };

  const doDelete = async () => {
    const res = await DiscTrackerAPI.adminDeleteUser(selectedUser);
    setModalState(!modalState);
    let updateAccList = accounts.results.filter(
      acc =>
        acc.username.toLowerCase() !== selectedUser.toLowerCase() &&
        acc.isAdmin === false
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
      const result = await DiscTrackerAPI.getUsers(page, 15, formData.username);
      const userList = result.results.filter(
        acc =>
          acc.username.toLowerCase() !== user.username.toLowerCase() &&
          acc.isAdmin === false
      );
      setAccounts({ ...result, results: userList });
    }
    fetchUsers();
  };

  const handleReset = e => {
    e.preventDefault();
    setFormData(initialForm);
    const fetchAccounts = async () => {
      const result = await DiscTrackerAPI.getUsers(page);
      const userList = result.results.filter(
        acc =>
          acc.username.toLowerCase() !== user.username.toLowerCase() &&
          acc.isAdmin === false
      );
      setAccounts({ ...result, results: userList });
    };
    if (user && user.isAdmin) fetchAccounts();
  };

  let isPrev;
  let isNext;

  if (accounts) {
    isPrev = accounts.previous ? false : true;
    isNext = accounts.next ? false : true;
  } else {
    isPrev = true;
    isNext = true;
  }

  console.log(accounts);

  return (
    <div className="AdminUsers">
      <h3>User Management</h3>
      <p>{flashMsg}</p>
      <div className="AdminUsers-users-container">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
        />
        <div>
          <button onClick={handleSubmit}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>

        <button onClick={decrementPage} disabled={isPrev}>
          prev
        </button>
        <span>{page}</span>
        <button onClick={incrementPage} disabled={isNext}>
          next
        </button>
        <ul>
          {accounts &&
            accounts.results.map(acc => (
              <li key={acc.username}>
                <span
                  onClick={() => {
                    handleClick(acc);
                  }}
                >
                  {acc.username}
                </span>{" "}
                <button className="user-delete-btn" onClick={handleDeleteClick}>
                  X
                </button>
              </li>
            ))}
          {modalState && (
            <DeleteUserModal
              username={selectedUser}
              setModalState={setModalState}
              doDelete={doDelete}
              modalState={modalState}
            />
          )}
        </ul>
      </div>
    </div>
  );
}

export default AllUsers;
