// src/routes/adminRoutes.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

import StudentForm from "../../pages/shared/StudentForm";
import FacultyForm from "../../pages/shared/FacultyForm";
import CourseForm from "../../pages/shared/CourseForm";
import UpdateForm from "../../pages/shared/UpdateForm";
import EventForm from "../../pages/shared/EventForm";
import MaterialForm from "../../pages/shared/MaterialForm";
import NewClass from "../../pages/class/CreateClass";
import NewTimeTable from '../../pages/timetable/NewTimeTable';
import EditSchool from '../../pages/school/EditSchool';

// Components
import Layout from '../../components/sidebar/Layout';
import TableWithoutAction from '../../components/table/TableWithoutAction';
import List from '../../components/shared/list/List';

// Datatable Columns
import { studentColumns } from "../datatablesource/studentColumns";
import { facultyColumns } from "../datatablesource/facultyColumns";
import { updateColumns } from "../datatablesource/updateColumns";
import { courseColumns } from "../datatablesource/courseColumns";
import { attendanceColumns } from '../datatablesource/attendanceColumns';
import { marksColumns } from '../datatablesource/marksColumns';
import { materialColumns } from '../datatablesource/materialColumns';

// Form Inputs
import { studentInputs } from "../formsource/studentInputs";
import { facultyInputs } from "../formsource/facultyInputs";
import { updateInputs } from "../formsource/updateInputs";
import { courseInputs } from "../formsource/courseInputs";
import { classInputs } from '../formsource/classInputs';
import { eventInputs } from '../formsource/eventInputs';
import { materialInputs } from '../formsource/materialInputs';

// Pages
import FacultyProfile from "../../pages/profile/FacultyProfile";
import StudentProfile from '../../pages/profile/StudentProfile';
import Class from "../../pages/class/Class";
import ViewClass from "../../pages/class/ViewClass";
import Timetable from '../../pages/timetable/Timetable';
import EventsList from '../../pages/event/EventsList';
import ResetPassword from '../../pages/auth/ResetPassword';
import AdminHome from '../../pages/home/AdminHome';
import AddExamDates from '../../pages/exams/AddExamDates';
import { checkAdmin } from '../shared/commons';

const AdminRoutes = () => {

  const { user } = useSelector(state => state.auth);
  
  const RequireAdmin = ({ children }) => {
    if (user && checkAdmin(user.role)) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
};

  return (
      <RequireAdmin>
        <Layout>

        <Routes>
          <Route 
            index
            element={<RequireAdmin><AdminHome/></RequireAdmin>} 
            />
          
        {/* ROUTES FOR STUDENTS */}
          
          {/* list of students */}
          <Route 
            path="students" 
            element={<List column={studentColumns} name="Student" />} 
            />
          
          {/* single page for student */}
          <Route 
            path="students/single/:id" 
            element={<StudentProfile type="Admin" />} 
          />
          
          {/* edit page for student */}
          <Route 
            path="students/edit/:id" 
            element={<StudentForm mode="edit" inputs={studentInputs} title="Update Student" />} 
            />

          {/* create user student */ }
          <Route 
            path="students/new" 
            element={<StudentForm mode="create" inputs={studentInputs} title="Add New Student" />} 
            />


        {/* ROUTES FOR FACULTIES */}

          {/* list of faculties */}
          <Route 
            path="faculties" 
            element={<List column={facultyColumns} name="Faculty" />}
            />

          {/* single page for faculty */}
          <Route 
            path="faculties/single/:id" 
            element={<FacultyProfile type="Admin" />} 
            />

          {/* edit page for faculty */}
          <Route 
            path="faculties/edit/:id/" 
            element={<FacultyForm mode="edit" inputs={facultyInputs} title="Update Faculty" />}
            />

          {/* create faculty */}
          <Route 
            path="faculties/new" 
            element={<FacultyForm mode="create" inputs={facultyInputs} title="Add New Faculty" />} 
            />


        {/* ROUTES FOR UPDATES */}

          {/* list of updates */}
          <Route 
            path="updates" 
            element={<List column={updateColumns} name="Update" />} 
            />

          {/* edit update */}
          <Route
            path="updates/edit/:id"
            element={ <UpdateForm mode="edit" inputs={updateInputs} title="Edit Updates" />}
            />

          {/* create update page */}
          <Route
            path="updates/new"
            element={<UpdateForm mode="create" inputs={updateInputs} title="Add New Update"  /> }
            />
        
        {/* ROUTES FOR COURSES */}

          {/* list of courses */}

          <Route
            path="courses"
            element={ <List column={courseColumns} name="Course"/>}
            />

          {/*  create new courses */}

            <Route
              path="courses/new"
              element={ <CourseForm mode="create" inputs={courseInputs} title="Add New Course" />}
            />

          {/* edit courses */}

          <Route
            path="courses/edit/:id/"
            element={ <CourseForm mode="edit" inputs={courseInputs} title="Edit Courses" />}
            />

        {/* ROUTES FOR MATERIALS */}

          {/* create material */}
          <Route
            path="materials/new"
            element={ <MaterialForm mode="create" inputs={materialInputs} title="Upload Material"/>}
          />

          {/* list of materials */}
          <Route
            path="materials"
            element={ <List column={materialColumns} name="Material"/>}
          />

          {/* edit materials */}
          <Route
            path="materials/edit/:id"
            element={ <MaterialForm mode="edit" inputs={materialInputs} title="Edit Material"/>}
          />

        {/* ROUTES FOR CLASSES */}

          {/* create classes */}

          <Route
            path="classes/new"
            element={ <NewClass inputs={classInputs} title="Add New Class"/>}
          />

          {/* list of classes */}

          <Route
            path="classes"
            element={ <Class />}
            />

          {/* attendance of classes */}

          <Route
            path="classes/attendance/:classId"
            element={ <TableWithoutAction column={attendanceColumns} name="Attendance" />}
            />

          {/* marks of classes */}

          <Route
            path="classes/marks/:classId"
            element={ <TableWithoutAction column={marksColumns} name="Marks" />}
            />

          {/* view class */}
          <Route
            path="classes/:classId"
            element={ <ViewClass />}
            />

        {/* ROUTES FOR EVENTS */}

          {/* edit events */}
          <Route
            path="events/edit/:id"
            element={ <EventForm mode="edit" inputs={eventInputs} title="Edit Event" />}
            />

          {/* create events */}
          <Route
            path="events/new"
            element={ <EventForm mode="create" inputs={eventInputs}  title="Add New Event" />}
          />

          {/* list of events */}
          <Route
            path="events"
            element={ <EventsList type="Admin"/>}
          />

        {/* ROUTES FOR TIMETABLES */}

          {/* create new timetables */}
          <Route
            path="timetables/new"
            element={ <NewTimeTable />}
          />
          <Route
            path="timetables/new/:classId"
            element={ <NewTimeTable />}
          />

          {/* view timetables */}
          <Route
            path='timetables/:classId'
            element={<Timetable type="class"/>}
            />

        {/* Add exam dates */}
        <Route
          path="exams/dates"
          element={<AddExamDates />}
        />
        <Route
          path="exams/dates/:classId"
          element={<AddExamDates />}
        />

        {/* ROUTES FOR SCHOOLS & SESSIONS */}
          {/* create new timetables */}
          <Route
            path='school/edit/:id'
            element={<EditSchool title="Edit School Info" />}
          />

          {/* edit password */}
          <Route
            path="updatePassword/:token"
            element={<ResetPassword type="change"/>}
          />

          <Route
            path="session"
          />

        </Routes>
        </Layout>
      </RequireAdmin>
  );
};

export default AdminRoutes;
