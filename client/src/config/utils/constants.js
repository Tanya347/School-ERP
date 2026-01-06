import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const successMsg = "success";
export const somethingWentWrongMsg = "Something went wrong";

export const coursesConst = "courses";
export const eventsConst = "events";
export const materialsConst = "materials";
export const studentsConst = "students";
export const facultiesConst = "faculties";
export const testsConst = "tests";
export const tasksConst = "tasks";
export const updatesConst = "updates";
export const schoolsConst = "schools";
export const sessionsConst = "sessions";
export const classesConst = "classes";

export const noticeTypes = [
    { _id: 'general', name: 'General' },
    { _id: 'specific', name: 'Specific' },
];

export const genderTypes = [
    { _id: 'Male', name: 'Male' },
    { _id: 'Female', name: 'Female' },
];

export const today = new Date();
export const todayDay = today.toLocaleDateString('en-US', { weekday: 'long' });

export const DEFAULT_PLACEHOLDER =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

export const profile_url = "https://i.ibb.co/MBtjqXQ/no-avatar.gif";

export const PIE_CHART_COLORS = ['#48A6A7', '#9ACBD0', '#F2EFE7', '#006A71'];

export const dateTimeFormat  = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export const loginImagePaths = {
  "Faculty": "/Assets/faculty.jfif",
  "Student": "/Assets/student.jfif",
  "Admin": "/Assets/admin.jfif"
}

export const FACULTY_HOME_COLORS = ['var(--light-blue)', 'var(--light-pink)', 'var(-light-yellow)', 'var(light-green)', 'var(light-red)'];

export const roles = {
  admin: "admin",
  faculty: "faculty",
  student: "student"
}

export const iconTypes = {
    info: <InfoIcon className='icon' />,
    error: <ErrorIcon className='icon' />,
    success: <CheckCircleIcon className='icon' />
};

export const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

export const marksColumns = [
  { field: "name", label: "Subject Name" },
  { field: "marks", label: "Marks Obtained" },
  { field: "maxMarks", label: "Maximum Marks" },
  { field: "grade", label: "Grade" },
];

export const attendanceColumns = [
    {
      field: "name",
      label: "Name",
      headerStyle: { fontWeight: "bold" },
    },
    {
      field: "enroll",
      label: "Enrollment Number",
      headerStyle: { fontWeight: "bold" },
    },
    {
      field: "status",
      label: "Status",
      headerStyle: { fontWeight: "bold" },
      render: (value) => (
        <span className={`status ${value}`}>{value}</span>
      ),
    },
  ];