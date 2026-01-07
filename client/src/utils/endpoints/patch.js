export const editCourse = (facId, sclass, course, type) => {
    return `/faculties/${type}/${facId}/${sclass}/${course}`
}