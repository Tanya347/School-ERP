export const exportColumnMap = {
  students: ["name", "username", "email", "enroll", "dob", "gender", "classID.name", "studentPhone", "studentAddress"],
  faculties: ["enroll","teachername", "email", "username", "facultyPhone", "facultyAddress", "joiningYear", "gender", "dob"],
  courses: ["name", "subjectCode", "classID.name", "teacher.teachername"],
  classes: ["name", "minAge", "maxAge", "totalStrength"],
  materials: ["title", "description", "classID.name"],
  tasks: ["title", "desc", "deadline", "courseID.subjectCode"],
  tests: ["name", "totalMarks", "date", "syllabus", "state", "duration", "subject.subjectCode"],
  updates: ["title", "desc", "updateType", "classID.name"],
};