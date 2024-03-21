import axios from "axios";

//takes in image, uploads to cloudinary API & returns URL string.

export async function uploadImage(img) {
  const formData = new FormData();
  formData.append("file", img);
  formData.append("upload_preset", "vznudtlg");
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/disctracker/image/upload",
    formData
  );

  return res.data.secure_url;
}

export function getPublicIdFromUrl(url) {
  const splitUrl = url.split("/");
  const id = splitUrl[splitUrl.length - 1].split(".")[0];
  return id;
}
