export const postURLs = (path, type) => {
    if(type === "login") {
        if(path === "Student")
            return `/auth/loginStudent`
        else if(path === "Faculty")
            return `/auth/loginFaculty`
        else
            return `/auth/loginAdmin`
    }
    else if(type === "register")
        return path === "student" ? `/students/registerStudent` : `/faculties/registerFaculty`
    
    else
        return `/${path}`
}

export const forgotPaswordURL = (type) => {
    return `/auth/forgotPassword/${type}`
}

const ROLE_API_MAP = {
  admin: "admins",
  student: "students",
  faculty: "faculties",
};

export const resetPasswordURL = (type, token, role) => {
  if (type === "change") {
    const rolePath = ROLE_API_MAP[role];
    return `/${rolePath}/updatePassword/${token}`;
  }

  return `/auth/resetPassword/${type}/${token}`;
};

export const  bulkCreateTimetable = () => {
  return `/timetables/bulkCreate`;
}

export const bulkDelete = (type) => {
  return `/${type}/bulk/delete`
}

export const validateEndpoint = () => {
  return `${process.env.REACT_APP_API_URL}/auth/validate`
}

export const logoutEndpoint = () => {
 return `${process.env.REACT_APP_API_URL}/auth/logout`
}


