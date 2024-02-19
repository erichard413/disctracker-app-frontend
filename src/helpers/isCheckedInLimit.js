// helper function to prevent users from repeatedly checking in discs

export function setCheckInLimit(discId) {
  const now = new Date();

  const expiration = new Date(now.getTime() + 86400000);

  const lsData = JSON.parse(localStorage.getItem("userCheckins")) || {};
  const updated = { ...lsData, [discId]: expiration };
  localStorage.setItem("userCheckins", JSON.stringify(updated));
  return;
}

export function isCheckedInLimit(discId) {
  const lsData = JSON.parse(localStorage.getItem("userCheckins")) || null;
  if (!lsData) return false;
  if (!lsData[discId]) return false;
  // check to see if limit expired -> if expired delete the entry from ls and return false
  const now = new Date();
  if (now.getTime() > new Date(lsData[discId])) {
    delete lsData[discId];
    localStorage.setItem("userCheckins", JSON.stringify(lsData));
    return false;
  } else {
    return true;
  }
}
