

export const postURLs = (path, type) => {
    if(type === "login") {
        if(path === "Student")
            return `${process.env.REACT_APP_API_URL}/students/loginStudent`
        else if(path === "Faculty")
            return `${process.env.REACT_APP_API_URL}/faculties/loginFaculty`
        else
            return `${process.env.REACT_APP_API_URL}/admins/loginAdmin`
    }
    else if(type === "register")
        return path === "students" ? `${process.env.REACT_APP_API_URL}/students/registerStudent` : `${process.env.REACT_APP_API_URL}/faculties/registerFaculty`
    else
        return `${process.env.REACT_APP_API_URL}/${path}`
}