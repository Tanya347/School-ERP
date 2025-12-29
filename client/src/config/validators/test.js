import validator from "validator";

export const validateTest = (id, value) => {
  switch (id) {

    case "name":
      if (!value?.trim()) return "Title is required";
      if (!validator.isLength(value, { min: 5 }))
        return "Title must be at least 5 characters";
      if (!validator.isLength(value, { max: 50 }))
        return "Title must be less than 50 characters";
      return "";

    case "subject":
      if (!value) return "Subject is required";
      return "";

    case "syllabus":
      if (!value?.trim()) return "Syllabus is required";
      if (!validator.isLength(value, { min: 5 }))
        return "Syllabus must be at least 5 characters";
      if (!validator.isLength(value, { max: 100 }))
        return "Syllabus must be less than 100 characters";
      return "";

    case "duration":
      if (!value?.toString().trim()) return "Duration is required";
      if (!validator.isFloat(value.toString(), { min: 1 }))
        return "Duration must be a positive number";
      return "";

    case "date":
      if (!value) return "Test date is required";
      if (!validator.isISO8601(value))
        return "Test date and time must be valid";
      return "";

    case "sclass":
      if (!value) return "Class is required";
      return "";

    case "totalMarks":
      if (!value?.toString().trim()) return "Total marks is required";
      if (!validator.isFloat(value.toString(), { min: 1 }))
        return "Total marks must be a positive number";
      return "";

    default:
      return "";
  }
};
