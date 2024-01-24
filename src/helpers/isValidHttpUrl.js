export function isValidImageUrl(string) {
  let url;

  let split = string.split(".");
  let extension = split[split.length - 1];
  if (
    extension.toLowerCase() != "jpg" &&
    extension.toLowerCase() != "png" &&
    extension.toLowerCase() != "jpeg" &&
    extension.toLowerCase() != "gif"
  )
    return false;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
