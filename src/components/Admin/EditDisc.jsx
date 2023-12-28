import { useUser } from "../../hooks/useUserContext";
import { useDiscs } from "../../hooks/useDiscContext";
import { EditDiscForm } from "../../forms/Admin/EditDiscForm";
import { useParams } from "react-router-dom";
import defaultDiscImg from "../../assets/disc-images/default-disc.png";

export function EditDisc() {
  const discId = useParams();
  const { discs, setDiscs } = useDiscs();
  console.log(discs);
  const { user } = useUser();
  if (user && !user.isAdmin) {
    navigate("/", { replace: true });
    return;
  }

  // to replace image if image URL is not found/forbidden.
  function replaceImage(error) {
    error.target.src = defaultDiscImg;
  }

  const imgURL = `/src/assets/disc-images/disc-${discId}.png`;
  return (
    <div className="EditDisc">
      <h2>Edit Disc</h2>
      <img
        style={{ width: "150px" }}
        src={imgURL}
        alt={`Disc Golf Disc`}
        onError={replaceImage}
      />
      <EditDiscForm />
    </div>
  );
}
