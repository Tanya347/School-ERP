

const api_url = process.env.REACT_APP_API_URL

export const postURLs = (path, type) => {
    if(type === "login") {
        if(path === "Student")
            return `${api_url}/auth/loginStudent`
        else if(path === "Faculty")
            return `${api_url}/auth/loginFaculty`
        else
            return `${api_url}/auth/loginAdmin`
    }
    else if(type === "register")
        return path === "student" ? `${api_url}/students/registerStudent` : `${api_url}/faculties/registerFaculty`
    
    else
        return `${api_url}/${path}`
}

export const forgotPaswordURL = (type) => {
    return `${api_url}/auth/forgotPassword/${type}`
}

const ROLE_API_MAP = {
  admin: "admins",
  student: "students",
  faculty: "faculties",
};

export const resetPasswordURL = (type, token, role) => {
  if (type === "change") {
    const rolePath = ROLE_API_MAP[role];
    return `${api_url}/${rolePath}/updatePassword/${token}`;
  }

  return `${api_url}/auth/resetPassword/${type}/${token}`;
};


