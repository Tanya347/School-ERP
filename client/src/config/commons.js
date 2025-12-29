export const periodTimes = {
    1: { start: "08:00", end: "08:45" },
    2: { start: "08:50", end: "09:35" },
    3: { start: "09:40", end: "10:25" },
    4: { start: "10:30", end: "11:15" },
    5: { start: "11:20", end: "12:05" },
    6: { start: "12:10", end: "12:55" },
    7: { start: "13:00", end: "13:45" },
    8: { start: "13:50", end: "14:35" },
  };

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const periods = Array.from({ length: 8 }, (_, i) => i + 1);

export const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  
  // Convert 24-hour time to 12-hour time
  hours = hours % 12;
  // If hours is 0, set it to 12 (midnight or noon)
  hours = hours === 0 ? 12 : hours;
  
  // Pad minutes with leading zero if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${formattedMinutes} ${period}`;
};

export const formatDate = (dateInput) => {

  const date = new Date(dateInput);

  // Check if date is invalid
  if (isNaN(date.getTime())) {
    return ''; // Return an empty string or handle the invalid date as needed
  }
  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return formattedDate;
}

export const handleChange = (e, setInfo, setErrors, validator) => {
  const { id, value } = e.target;
  setInfo((prev) => ({ ...prev, [id]: value }));
  const error = validator(id, value);
  setErrors((prev) => ({ ...prev, [id]: error }));
};