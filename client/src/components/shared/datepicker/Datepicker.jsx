import "react-datepicker/dist/react-datepicker.css";
import "./datePickerComponent.scss"

import DatePicker from "react-datepicker";

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
