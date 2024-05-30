const api_url = process.env.REACT_APP_API_URL

export const getDeleteURL = (path, id) => {
    return `${api_url}/${path}/${id}`;
}

export const getClearClassURL = (classid) => {
    return `${api_url}/attendances/class/${classid}`
}

export const getClearDayAttendance = (id) => {
    return `${api_url}/attendances/single/${id}`
}

export const getClearMarksSubject = (id) => {
    return `${api_url}/students/marks/subject/${id}`
}