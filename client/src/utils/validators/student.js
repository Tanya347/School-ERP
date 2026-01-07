import validator from "validator";

export const validateStudent = (id, value) => {
  switch (id) {
    case "name":
      if (!value.trim()) return "Student name is required";
      if (value.length < 3) return "Student name must be at least 3 characters";
      if (value.length > 50) return "Student name must be less than 50 characters";
      if (!validator.isAlpha(value.replace(/\s/g, ''))) return "Name should contain only letters and spaces";
      return "";

    case "email":
      if (!value.trim()) return "Email is required";
      if (value.length > 50) return "Email must be less than 50 characters";
      if (!validator.isEmail(value)) return "Invalid email address";
      return "";

    case "enroll":
      if (!value.trim()) return "Enrollment number is required";
      if (!validator.isAlphanumeric(value)) return "Enrollment should contain only letters and numbers";
      return "";

    case "password":
      if (!value.trim()) return "Password is required";
      if (!validator.isStrongPassword(value, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }))
        return "Password must be 6+ chars with uppercase, lowercase, number & symbol";
      return "";

    case "studentPhone":
      if (!value.trim()) return "Phone number is required";
      if (!validator.isMobilePhone(value, "any")) return "Invalid phone number";
      return "";

    case "studentAddress":
      if (!value.trim()) return "Address is required";
      if (value.length < 10) return "Address must be at least 10 characters";
      if (value.length > 200) return "Address must be less than 200 characters";
      return "";

    case "dob":
      if (!value.trim()) return "Date of birth is required";
      if (!validator.isDate(value, { format: 'YYYY-MM-DD', strictMode: true }))
        return "Invalid date format (YYYY-MM-DD)";
      return "";

    case "username":
      if (!value.trim()) return "Username is required";
      if (value.length < 5) return "Username must be at least 5 characters";
      // if (!validator.isAlphanumeric(value)) return "Username should contain only letters and numbers";
      return "";

    case "gender":
      if (!value) return "Gender is required";
      if (!["Male", "Female"].includes(value)) return "Gender must be Male or Female";
      return "";

    default:
      return "";
  }
};
