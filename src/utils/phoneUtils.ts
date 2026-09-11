/**
 * Utility functions for phone/mobile number formatting and validation.
 * Standard format across Bharat Enterprises Finance Services:
 * XX-XXX-XXX-XX (e.g. 70-580-612-64)
 */

/**
 * Formats any raw input string into the standard Indian mobile structure:
 * XX-XXX-XXX-XX (e.g. 70-580-612-64)
 * 
 * Handles:
 * - Digit-by-digit typing
 * - Copy-pasting numbers with country code +91 / 91
 * - Copy-pasting numbers with leading 0
 * - Backspacing / deletion
 */
export const formatPhoneNumber = (raw: string): string => {
  if (!raw) return '';

  // Extract all numeric digits
  let digits = raw.replace(/\D/g, '');

  // If user pasted a 12-digit number starting with 91 (India country code), strip it
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    // If user pasted an 11-digit number starting with 0, strip it
    digits = digits.slice(1);
  }

  // Mobile numbers in India are strictly 10 digits
  digits = digits.slice(0, 10);

  // Group: 2 - 3 - 3 - 2
  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 5);
  const p3 = digits.slice(5, 8);
  const p4 = digits.slice(8, 10);

  let result = p1;
  if (p2) result += '-' + p2;
  if (p3) result += '-' + p3;
  if (p4) result += '-' + p4;

  return result;
};

/**
 * Extracts raw digits (up to 10) from a formatted or unformatted phone string.
 */
export const getRawPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
};

/**
 * Validates whether the given string is a valid 10-digit Indian mobile number.
 * Must have exactly 10 digits and start with 6, 7, 8, or 9.
 */
export const isValidMobileNumber = (phone: string): boolean => {
  const digits = getRawPhoneNumber(phone);
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
};
