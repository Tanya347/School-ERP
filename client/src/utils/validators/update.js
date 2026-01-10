import validator from "validator";

export const validateUpdate = (id, value, extra = {}) => {
  const { updateType } = extra;

  switch (id) {

    case "title":
      if (!value?.trim()) return "Title is required";
      if (!validator.isLength(value, { min: 5 }))
        return "Title must be at least 5 characters";
      if (!validator.isLength(value, { max: 50 }))
        return "Title must be less than 50 characters";
      return "";

    case "desc":
      if (!value?.trim()) return "Description is required";
      if (!validator.isLength(value, { min: 5 }))
        return "Description must be at least 5 characters";
      if (!validator.isLength(value, { max: 500 }))
        return "Description must be less than 500 characters";
      return "";

    case "updateType":
      if (!value) return "Update type is required";
      if (!["general", "specific"].includes(value))
        return "Update type must be General or Specific";
      return "";

    case "classID":
      if (updateType === "specific" && !value)
        return "Class is required for specific updates";
      return "";

    default:
      return "";
  }
};
