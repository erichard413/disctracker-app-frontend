import { useDiscs } from "../../hooks/useDiscContext";
import { useEffect, useState } from "react";
import { AdminDiscsSearchForm } from "../../forms/Admin/AdminDiscsSearchForm";

function AllDiscs() {
  const { discs, setDiscs } = useDiscs();
  const [currentDiscs, setCurrentDiscs] = useState([]);

  useEffect(() => {
    discs && setCurrentDiscs([...discs]);
  }, [discs]);

  return (
    <div className="AllDiscs">
      <h2>All Discs</h2>
      <div className="hr-line-grey"></div>
      <div className="hr-line-teal"></div>

      <div className="disc-card-container">
        {currentDiscs?.map(d => (
          <AdminDiscCard key={d.id} disc={d} />
        ))}
      </div>
      <AdminDiscsSearchForm setCurrentDiscs={setCurrentDiscs} />

      {/* <Modal
          modalState={modalState}
          setModalState={setModalState}
          navTo={"/admin/users"}
        >
          <DeleteUserModal username={selectedUser} doDelete={doDelete} />
        </Modal> */}
    </div>
  );
}

function AdminDiscCard({ disc }) {
  return (
    <div className="adminDiscCard">
      <ul>
        <li>{disc.name}</li>
        <li>{disc.id}</li>
      </ul>
    </div>
  );
}

export default AllDiscs;
