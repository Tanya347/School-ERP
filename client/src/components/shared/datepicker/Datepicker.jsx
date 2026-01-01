// components/DatePickerComponent.js
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datePickerComponent.scss"

const DatePickerComponent = ({ selectedDate, onChange, placeholder, showTimeSelect = true, className = "", label }) => {
  return (
    <div className="data-picker-component">
        <label>{label}</label>
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          showTimeSelect={showTimeSelect}
          placeholderText={placeholder}
          className={className || "date-picker"}
        />
    </div>
  );
};

export default DatePickerComponent;
