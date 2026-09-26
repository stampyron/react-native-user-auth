import {
  isValidEmail,
  isValidPassword,
  isValidName,
  validateLoginForm,
  validateSignupForm,
} from '../src/utils/validation';

describe('Validation Utility Suite', () => {
  describe('Email Validation (isValidEmail)', () => {
    it('accepts valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('hello_world@company.org')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missinguser.com')).toBe(false);
      expect(isValidEmail('missingdomain@')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });
  });

  describe('Password Validation (isValidPassword)', () => {
    it('accepts passwords of 6 characters or longer', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('strongP@ssword123')).toBe(true);
    });

    it('rejects passwords shorter than 6 characters or empty', () => {
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('abc')).toBe(false);
      expect(isValidPassword(null)).toBe(false);
    });
  });

  describe('Name Validation (isValidName)', () => {
    it('accepts valid non-empty names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('Alice')).toBe(true);
    });

    it('rejects empty or whitespace-only names', () => {
      expect(isValidName('')).toBe(false);
      expect(isValidName('   ')).toBe(false);
      expect(isValidName(null)).toBe(false);
    });
  });

  describe('Login Form Validation (validateLoginForm)', () => {
    it('returns errors for empty fields', () => {
      const result = validateLoginForm({ email: '', password: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.password).toBe('Password is required');
    });

    it('returns error for invalid email format', () => {
      const result = validateLoginForm({ email: 'bademail', password: 'password123' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBeUndefined();
    });

    it('returns error for short password', () => {
      const result = validateLoginForm({ email: 'test@example.com', password: '123' });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe('Password must be at least 6 characters');
    });

    it('succeeds with valid login credentials', () => {
      const result = validateLoginForm({ email: 'test@example.com', password: 'validPassword123' });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });

  describe('Signup Form Validation (validateSignupForm)', () => {
    it('returns errors when all fields are empty', () => {
      const result = validateSignupForm({ name: '', email: '', password: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Full name is required');
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.password).toBe('Password is required');
    });

    it('flags short password and invalid email in signup', () => {
      const result = validateSignupForm({
        name: 'Jane Doe',
        email: 'invalid-email',
        password: '123',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Password must be at least 6 characters');
    });

    it('succeeds with complete valid signup data', () => {
      const result = validateSignupForm({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'securePassword99',
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});
