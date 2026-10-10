const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_PASSWORD_LENGTH = 8;

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const isValidEmail = (email) => EMAIL_REGEX.test(normalizeEmail(email));

/**
 * Returns an error message, or null when the password is acceptable.
 */
const validatePassword = (password) => {
  if (typeof password !== "string" || password.length === 0) {
    return "Password is required";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (password.length > 72) {
    // bcrypt only uses the first 72 bytes of the input
    return "Password must be 72 characters or fewer";
  }

  return null;
};

module.exports = {
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  isValidEmail,
  validatePassword,
};
