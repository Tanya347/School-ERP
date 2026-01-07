export const putURLs = (path, id) => {
    return `/${path}/${id}`;
}

export const addMarks = (course) => {
    return `/marks/${course}`
}

export const addClassTeacher = (sclass) => {
    return `/classes/classTeacher/${sclass}`
}

export const setExamDates = () => {
    return `/courses/exam/setdates`;
}

export const testAction = (action, id) => {
    return `/tests/${action}/${id}`
}

export const addTestMarks = (id) => {
    return `/tests/addMarks/${id}`
}