export const facultyProfileFields = (data) => [
  { label: "Registration Number", value: data?.enroll },
  { label: "Username", value: data?.username },
  { label: "Email", value: data?.email },
  { label: "Phone Number", value: data?.facultyPhone },
  { label: "Address", value: data?.facultyAddress },
  { label: "Joining Year", value: data?.joiningYear },
  { label: "Gender", value: data?.gender },
  { label: "Date of Birth", value: data?.dob },
];

export const studentProfileFields = (data) => [
  { label: "Enrollment Number", value: data?.enroll },
  { label: "Username", value: data?.username },
  { label: "Email", value: data?.email },
  { label: "Phone Number", value: data?.studentPhone },
  { label: "Address", value: data?.studentAddress },
  { label: "Class", value: data?.classname },
  { label: "Gender", value: data?.gender },
  { label: "Date of Birth", value: data?.dob },
];