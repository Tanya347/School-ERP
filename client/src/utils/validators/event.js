import validator from "validator";

export const validateEvent = (id, value, extra = {}) => {
  switch (id) {

    case "name":
      if (!value?.trim()) return "Event name is required";
      if (!validator.isLength(value, { min: 3 }))
        return "Event name must be at least 3 characters";
      if (!validator.isLength(value, { max: 100 }))
        return "Event name must be less than 100 characters";
      return "";

    case "desc":
      if (!value?.trim()) return "Description is required";
      if (!validator.isLength(value, { min: 10 }))
        return "Description must be at least 10 characters";
      if (!validator.isLength(value, { max: 500 }))
        return "Description must be less than 500 characters";
      return "";

    case "venue":
      if (!value?.trim()) return "Venue is required";
      if (!validator.isLength(value, { min: 3 }))
        return "Venue must be at least 3 characters";
      if (!validator.isLength(value, { max: 100 }))
        return "Venue must be less than 100 characters";
      return "";

    case "startDate":
      if (!value) return "Start date is required";
      if (!validator.isISO8601(value))
        return "Start date must be a valid date";
      return "";

    case "endDate":
      if (!value) return "End date is required";
      if (!validator.isISO8601(value))
        return "End date must be a valid date";
      if (extra.startDate && new Date(value) < new Date(extra.startDate))
        return "End date must be after start date";
      return "";

    case "registerLink":
      if (value && !validator.isURL(value))
        return "Register link must be a valid URL";
      return "";

    case "contact":
      if (!value?.trim()) return "Contact is required";
      if (!validator.isMobilePhone(value, "any"))
        return "Contact must be a valid phone number";
      return "";

    default:
      return "";
  }
};
