/**
 * Lightweight frontend validation utilities mirroring backend Zod schemas.
 * Zero external dependencies.
 */

export const Validation = {
  isValidEmail(email: string): boolean {
    if (!email || !email.trim()) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  },

  isValidPhone(phone: string): boolean {
    if (!phone || !phone.trim()) return false;
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  },

  isValidPincode(pincode: string): boolean {
    if (!pincode || !pincode.trim()) return false;
    return /^[0-9]{6}$/.test(pincode.trim());
  },

  isValidPassword(password: string): boolean {
    return Boolean(password && password.length >= 6);
  },

  isPositiveNumber(val: unknown): boolean {
    if (val === undefined || val === null || val === "") return false;
    const n = Number(val);
    return !isNaN(n) && n > 0;
  },

  isValidName(name: string): boolean {
    return Boolean(name && name.trim().length >= 2);
  },

  isValidTitle(title: string): boolean {
    return Boolean(title && title.trim().length >= 5);
  },

  isValidDescription(desc: string, minChars = 20): boolean {
    return Boolean(desc && desc.trim().length >= minChars);
  },

  isValidAddress(addr: string): boolean {
    return Boolean(addr && addr.trim().length >= 5);
  },

  isValidLocality(loc: string): boolean {
    return Boolean(loc && loc.trim().length >= 2);
  },
};
