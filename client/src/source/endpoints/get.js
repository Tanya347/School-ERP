
export const getDatatableURL = (path, user) => {
    if(path === 'facTasks')
        return `/tasks/faculty/${user._id}`
    else if(path === 'stuTasks')
        return `/tasks/student/${user.class}`
    else if (path === 'facVideo')
        return `/video/faculty/${user._id}`
    else    
        return `/${path}`
}

export const getModalURL = (path, id) => {
    if(path === 'facTasks' || path === 'stuTasks' || path === 'tasks')
        return `/tasks/${id}`
    else if(path === 'facVideo')
        return `/video/${id}`
    else
        return `/${path}`
}

export const getCalenderURL = (user) => {
    if(user.isFaculty)
        return `/tasks/faculty/${user._id}`
    else if(user.isStudent)
        return `/tasks/student/${user.class}`
}