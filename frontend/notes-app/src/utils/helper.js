const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") {``
    return "";
  }
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export { validateEmail, validatePassword, getInitials };
