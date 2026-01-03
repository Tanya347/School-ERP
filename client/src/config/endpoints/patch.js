const api_url = process.env.REACT_APP_API_URL

export const editCourse = (facId, sclass, course, type) => {
    return `${api_url}/faculties/${type}/${facId}/${sclass}/${course}`
}