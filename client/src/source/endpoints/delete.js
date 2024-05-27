export const getDeleteURL = (path, id) => {
    return `${process.env.REACT_APP_API_URL}/${path}/${id}`;
}

export const getClearClassURL = (classid) => {
    return `${process.env.REACT_APP_API_URL}/attendances/class/${classid}`
}

export const getClearDayAttendance = (id) => {
    return `${process.env.REACT_APP_API_URL}/attendances/single/${id}`
}