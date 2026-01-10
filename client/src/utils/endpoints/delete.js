export const getDeleteURL = (path, id) => {
    return `/${path}/${id}`;
}

export const getClearClassURL = (classid) => {
    return `/attendances/class/${classid}`
}

export const getClearDayAttendance = (id) => {
    return `/attendances/single/${id}`
}

export const getClearMarksSubject = (id) => {
    return `/marks/subject/${id}`
}

export const getClearTimetableForClass = (classid) => {
    return `/timetables/${classid}`
}

export const clearExamDatesForClass = (sclass) => {
    return `/courses/exam/clear/${sclass}`
}

export const clearTestMarks = (id) => {
    return `/tests/marks/${id}`
}