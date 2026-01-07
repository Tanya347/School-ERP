import validator from "validator";

export const validateClass = (id, value) => {
  switch (id) {

    case "name":
      if (!value?.trim()) return "Class name is required";
      if (!validator.isLength(value, { min: 3 }))
        return "Class name must be at least 3 characters";
      if (!validator.isLength(value, { max: 10 }))
        return "Class name must be less than 10 characters";
      return "";

    case "classNumber":
      if (!value?.toString().trim()) return "Class number is required";
      if (!validator.isInt(value.toString(), { min: 1 }))
        return "Class number must be a positive number";
      return "";

    default:
      return "";
  }
};
