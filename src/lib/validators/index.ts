/**
 * Validation utilities
 */

export const validators = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string, minLength = 6): boolean => {
    return password.length >= minLength;
  },

  isStrongPassword: (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(password);
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  isValidURL: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isNotEmpty: (value: string): boolean => {
    return value?.trim().length > 0;
  },

  isValidLength: (value: string, min: number, max: number): boolean => {
    const length = value?.length || 0;
    return length >= min && length <= max;
  },
};

export const {
  isEmail,
  isValidPassword,
  isStrongPassword,
  isValidPhoneNumber,
  isValidURL,
  isNotEmpty,
  isValidLength,
} = validators;

export default validators;
