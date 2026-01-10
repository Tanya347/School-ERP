export const editCourse = (facId, course, type) => {
    return `/faculties/${type}/${facId}/${course}`
}