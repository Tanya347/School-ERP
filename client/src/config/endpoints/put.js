const api_url = process.env.REACT_APP_API_URL


export const putURLs = (path, id) => {
    return `${api_url}/${path}/${id}`;
}

export const addMarks = (course) => {
    return `${api_url}/marks/${course}`
}

export const addClassTeacher = (sclass) => {
    return `${api_url}/classes/classTeacher/${sclass}`
}

export const setExamDates = () => {
    return `${api_url}/courses/exam/setdates`;
}

export const testAction = (action, id) => {
    return api_url + `/tests/${action}/${id}`
}

export const addTestMarks = (id) => {
    return `${api_url}/tests/addMarks/${id}`
}