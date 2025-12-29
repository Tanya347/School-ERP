import validator from "validator";

export const validateMaterial = (id, value) => {
  switch (id) {

    case "name":
      if (!value?.trim()) return "Material name is required";
      if (!validator.isLength(value, { min: 3 }))
        return "Material name must be at least 3 characters";
      if (!validator.isLength(value, { max: 100 }))
        return "Material name must be less than 100 characters";
      return "";

    case "description":
      if (value && !validator.isLength(value, { min: 5 }))
        return "Description must be at least 5 characters";
      if (value && !validator.isLength(value, { max: 500 }))
        return "Description must be at most 500 characters";
      return "";

    default:
      return "";
  }
};
