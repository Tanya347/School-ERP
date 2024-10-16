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