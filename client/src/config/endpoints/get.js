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
        return user.role === 'student' ? `/tests/${user.role}/${user.class}` : `/tests/${user.role}/${user._id}`;
    else if(path === 'tasks')
        return user.role === 'student' ? `/tasks/${user.role}/${user.class}` : `/tasks/${user.role}/${user._id}`;
    else if(path === 'updates')
        return getTableURL(user) ;
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
    const base = `/updates`;
    if (user.role === 'faculty') return `${base}?facultyId=${user._id}`;
    if (user.role === 'student') return `${base}?classId=${user.class}`;
    return base;
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
    if(user.role === 'faculty')
        return `/tasks/faculty/${user._id}`
    else if(user.role === 'student')
        return `/tasks/student/${user.class}`
}

export const getTestCalenderURL = (user) => {
    if(user.role === 'faculty')
        return `/tests/faculty/${user._id}`
    else if(user.role === 'student')
        return `/tests/student/${user.class}`
}

export const getClassDetails = (cl) => {
    return `/classes/details/${cl}`
}

export const getSingleData = (id, type) => {
    switch(type) {
        case "courses" : return `/courses/${id}`;
        case "faculties" : return `/faculties/${id}`;
        case "students" : return `/students/${id}`;
        case "single-student" : return `/students/single/${id}`;
        case "tasks" : return `/tasks/${id}`;
        case "tests" : return `/tests/${id}`;
        case "events" : return `/events/${id}`;
        case "updates" : return `/updates/${id}`;
        default: return "/"
    }
}

export const getFacultyData = (id, type) => {
    return `/faculties/${type}/${id}`
}


