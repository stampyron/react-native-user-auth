/**
 * Email validation using standard pattern /\\S+@\\S+\\.\\S+/
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Password validation: must be at least 6 characters
 */
export function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
}

/**
 * Name validation: non-empty trimmed string
 */
export function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  return name.trim().length > 0;
}

/**
 * Validates the login form fields.
 * Returns an errors object where keys correspond to fields.
 * If form is valid, returns empty errors object {}.
 */
export function validateLoginForm(formData) {
  const errors = {};
  const { email, password } = formData || {};

  if (!email || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates the signup form fields.
 * Returns an errors object where keys correspond to fields.
 * If form is valid, returns empty errors object {}.
 */
export function validateSignupForm(formData) {
  const errors = {};
  const { name, email, password } = formData || {};

  if (!name || name.trim().length === 0) {
    errors.name = 'Full name is required';
  }

  if (!email || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
