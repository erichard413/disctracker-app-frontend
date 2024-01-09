// Helper function to help check if string input is an email.

export function isEmail(str) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!str.match(emailRegex)) return false;
  return true;
}
