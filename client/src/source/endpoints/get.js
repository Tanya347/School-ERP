export const getAllCount = "/getAllCount";
export const getQueries = "/queries";
export const getCourseClasses = '/classes/courses';
export const getClasses = "/classes"
export const getLectureCount = "/attendances/lecturecount"
export const getAttendanceDates = "/attendances/dates"

export const getAttendanceStatusByDate = (classid, date) => {
    return `/attendances/date/${classid}/${date}`
}

export const getClassCourses = (classId) =>{
    return `/classes/course/${classId}`
}

export const getStudentAttendance = (studentid, classid) => {
    return `/attendances/studentperc/${studentid}/${classid}`
}
export const getDatatableURL = (path, user) => {
    if(path === 'tests')
        return user.isFaculty? `/tests/faculty/${user._id}` : `/tests/student/${user.class}`
    else if(path === 'tasks')
        return user.isFaculty? `/tasks/faculty/${user._id}` : `/tasks/student/${user.class}`
    else    
        return `/${path}/`
}

export const getTableWithoutActionURL = (path, id) => {
    if(path === 'attendance')
        return `/attendances/classperc/${id}`
    else if(path === 'marks')
        return `/students/marks/class/${id}`
}

export const getTableURL = (user) => {
    if(user.isFaculty)
        return `/updates/faculty/${user._id}`
    else if(user.isStudent)
        return `/updates/student/${user.class}`
    else
        return '/updates'
}

export const getModalURL = (path, id) => {
    if(path === 'facTasks' || path === 'stuTasks' || path === 'tasks')
        return `/tasks/${id}`
    else if(path === 'facTests' || path === 'stuTests' || path === 'tests')
        return `/tests/${id}`
    else if(path === 'facVideo')
        return `/video/${id}`
    else
        return `/${path}/${id}`
}

export const getTaskCalenderURL = (user) => {
    if(user.isFaculty)
        return `/tasks/faculty/${user._id}`
    else if(user.isStudent)
        return `/tasks/student/${user.class}`
}

export const getTestCalenderURL = (user) => {
    if(user.isFaculty)
        return `/tests/faculty/${user._id}`
    else if(user.isStudent)
        return `/tests/student/${user.class}`
}

export const getClassDetails = (cl) => {
    return `/classes/details/${cl}`
}

export const getSingleData = (id, type) => {
    switch(type) {
        case "courses" : return `/courses/single/${id}`;
        case "faculties" : return `/faculties/${id}`;
        case "students" : return `/students/${id}`;
        case "single-student" : return `/students/single/${id}`;
        case "tasks" : return `/tasks/${id}`;
        case "tests" : return `/tests/${id}`;
        case "updates" : return `/updates/${id}`;
        default: return "/"
    }
}

export const getFacultyData = (id, type) => {
    return `/faculties/${type}/${id}`
}


