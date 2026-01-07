import validator from "validator";

export const validateCourse = (id, value) => {
  switch (id) {

    case "name":
      if (!value?.trim()) return "Course name is required";
      if (!validator.isLength(value, { min: 3 }))
        return "Course name must be at least 3 characters";
      if (!validator.isLength(value, { max: 100 }))
        return "Course name must be less than 100 characters";
      return "";

    case "subjectCode":
      if (!value?.trim()) return "Subject code is required";
      if (!validator.matches(value, /^[A-Za-z0-9_-]+$/))
        return "Subject code can contain only letters, numbers, _ or -";
      return "";

    case "class":
      if (!value) return "Class is required";
      return "";

    case "syllabusPicture":
      if (value && !validator.isURL(value, { require_protocol: true }))
        return "Syllabus picture must be a valid URL";
      return "";

    default:
      return "";
  }
};
