import validator from "validator";

export const validateTask = (id, value) => {
  switch (id) {

    case "title":
      if (!value?.trim()) return "Title is required";
      if (!validator.isLength(value, { min: 5 }))
        return "Title must be at least 5 characters";
      if (!validator.isLength(value, { max: 100 }))
        return "Title must be less than 100 characters";
      return "";

    case "desc":
      if (!value?.trim()) return "Description is required";
      if (!validator.isLength(value, { min: 10 }))
        return "Description must be at least 10 characters";
      if (!validator.isLength(value, { max: 500 }))
        return "Description must be less than 500 characters";
      return "";

    case "deadline":
      if (!value) return "Deadline is required";
      if (new Date(value) <= new Date())
        return "Deadline must be a future date";
      return "";

    case "sclass":
      if (!value) return "Class is required";
      return "";

    default:
      return "";
  }
};
