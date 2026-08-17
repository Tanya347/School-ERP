/**
 * Calculates the current age based on a date of birth.
 * @param {string|Date} dob - Date of birth.
 * @returns {number} - Calculated age.
 */
export const calculateAge = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Validates if an age is within a specific range.
 * @param {number} age - The age to validate.
 * @param {number} min - Minimum allowed age.
 * @param {number} max - Maximum allowed age.
 * @returns {boolean} - True if within range.
 */
export const validateAgeRange = (age, min, max) => {
  return age >= min && age <= max;
};

/**
 * Picks specific fields from an object.
 * Used to prevent mass-assignment vulnerabilities by filtering request bodies.
 * @param {Object} obj - The source object.
 * @param {string[]} allowedFields - Array of keys to keep.
 * @returns {Object} - A new object containing only allowed fields.
 */
export const pickFields = (obj, allowedFields) => {
  if (!obj || !allowedFields) return {};
  return allowedFields.reduce((acc, field) => {
    if (obj[field] !== undefined) {
      acc[field] = obj[field];
    }
    return acc;
  }, {});
};
