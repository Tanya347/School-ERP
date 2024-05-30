const api_url = process.env.REACT_APP_API_URL


export const putURLs = (path, id) => {
    return `${api_url}/${path}/${id}`;
}

export const addMarks = (course) => {
    return `${api_url}/students/marks/${course}`
}