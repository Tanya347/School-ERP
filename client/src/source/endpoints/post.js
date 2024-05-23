

const api_url = "http://localhost:5500/api"

export const postURLs = (path, type) => {
    if(type === "login") {
        if(path === "Student")
            return `${api_url}/students/loginStudent`
        else if(path === "Faculty")
            return `${api_url}/faculties/loginFaculty`
        else
            return `${api_url}/admins/loginAdmin`
    }
    else if(type === "register")
        return path === "students" ? `${api_url}/students/registerStudent` : `${api_url}/faculties/registerFaculty`
    else
        return `${api_url}/${path}`
}