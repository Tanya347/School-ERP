import { roles, tasksConst, testsConst, updatesConst } from "../utils/constants";

export const getAllCount = `/getAllCount`;
export const getQueries = "/queries";
export const getCourseClasses = '/classes/courses';
export const getClasses = "/classes"
export const getLectureCount = "/attendances/lecturecount"
export const getAttendanceDates = "/attendances/dates"
export const schoolGenderCount = '/students/gender/count';
export const getSchoolInfo = `/schools`;

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
    if(path === testsConst)
        return user.role === roles.student ? `/tests?classId=${user.class}` : `/tests?facultyId=${user._id}`;
    else if(path === tasksConst)
        return user.role === roles.student ? `/tasks?classId=${user.class}` : `/tasks?facultyId=${user._id}`;
    else if(path === updatesConst)
        return getUpdateURL(user) ;
    else    
        return `/${path}/`
}

export const getTimeTableURL = (id, type) => {
    if(type === 'faculty')
        return `/timetables?facultyId=${id}`;
    else if(type === 'class')
        return `/timetables?classId=${id}`;
}

export const getTableWithoutActionURL = (path, id) => {
    if(path === 'attendance')
        return `/attendances/classperc/${id}`
    else if(path === 'marks')
        return `/marks/class/${id}`
}

export const getUpdateURL = (user) => {
    const base = `/updates`;
    if (user.role === roles.faculty) return `${base}?facultyId=${user._id}`;
    if (user.role === roles.student) return `${base}?classId=${user.class}`;
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
    if(user.role === roles.faculty)
        return `/tasks?facultyId=${user._id}`
    else if(user.role === roles.student)
        return `/tasks?studentId=${user.class}`
}

export const getTestCalenderURL = (user) => {
    if(user.role === roles.faculty)
        return `/tests?facultyId=${user._id}`
    else if(user.role === roles.student)
        return `/tests?classId=${user.class}`
}

export const getClassDetails = (cl) => {
    return `/classes/details/${cl}`
}

export const getSingleData = (id, type) => {
    switch(type) {
        case "single-student" : return `/students/single/${id}`;
        default: return `/${type}/${id}`;
    }
}

export const getFacultyData = (id, type) => {
    return `/faculties/${type}/${id}`
}

export const getSession = (school) => {
    return `/sessions/${school}`
}

export const getLectures = (id, type) => {
    if(type === 'faculty')
        return `/timetables?facultyId=${id}`
    else if(type === 'student')
        return `/timetables?classId=${id}`
}
 export const getStudentsOfClass = (sclass) => {
    return `/classes/students/${sclass}`;
 }

 export const getClassExamDates = (sclass) => {
    return `/courses/exam/${sclass}`;
 }

 export const getMarksOfSubject = (course) => {
    return `/marks/subject/${course}`;
 }
