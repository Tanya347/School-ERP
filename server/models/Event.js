import mongoose from "mongoose";
import validator from "validator";

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Event name is required"],
        validate: {
          validator: function (v) {
            return validator.isLength(v, { min: 3, max: 100 }); // Name must be between 3 and 100 characters
          },
          message: "Event name should be between 3 and 100 characters",
        },
    },
    startDate: {
        type: String,
        required: [true, "Start date is required"],
        validate: {
          validator: function (v) {
            return validator.isISO8601(v); // Ensures the date is in ISO 8601 format
          },
          message: "Test date and time must be valid",
        },
    },
    endDate: {
        type: String,
        required: [true, "End date is required"],
        validate: [
          {
            validator: function (v) {
              return validator.isISO8601(v); // Ensures the date is in ISO 8601 format
            },
            message: "End date must be a valid ISO 8601 date",
          },
          {
            validator: function (v) {
              return new Date(v) >= new Date(this.startDate); // Ensures end date is not before start date
            },
            message: "End date must be after the start date",
          },
        ],
    },
    desc: {
        type: String,
        required: [true, "Event description is required"],
        validate: {
          validator: function (v) {
            return validator.isLength(v, { min: 10, max: 500 }); // Description must be between 10 and 500 characters
          },
          message: "Description should be between 10 and 500 characters",
        },
    },
    venue: {
        type: String,
        required: [true, "Event venue is required"],
        validate: {
          validator: function (v) {
            return validator.isLength(v, { min: 3, max: 100 }); // Venue must be between 3 and 100 characters
          },
          message: "Venue should be between 3 and 100 characters",
        },
    },
    registerLink: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || validator.isURL(v); // Validate URL if provided
          },
          message: "Register link must be a valid URL",
        },
    },
    contact: {
        type: String,
        required: [true, "Contact information is required"],
        validate: {
          validator: function (v) {
            return validator.isMobilePhone(v, "any"); // Validates that the contact is a valid phone number
          },
          message: "Contact must be a valid phone number",
        },
    },
    poster: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || validator.isURL(v, { require_protocol: true }); // Validate URL if provided
          },
          message: "Poster must be a valid URL",
        },
    },
    cloud_id: {
        type: String
    },
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School'
    },
    sessionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
}, { timestamps: true })

export default mongoose.model("Event", EventSchema);