import { useUser } from "../../hooks/useUserContext";
import { useDiscs } from "../../hooks/useDiscContext";
import { EditDiscForm } from "../../forms/Admin/EditDiscForm";

export function EditDisc() {
  const { discs, setDiscs } = useDiscs();
  console.log(discs);
  const { user } = useUser();
  if (user && !user.isAdmin) {
    navigate("/", { replace: true });
    return;
  }
  return (
    <div className="EditDisc">
      <h2>Edit Disc</h2>
      <EditDiscForm />
    </div>
  );
}
