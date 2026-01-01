// src/routes/adminRoutes.js
import { Routes, Route, Navigate } from 'react-router-dom';

import List from '../../components/list/List';
import NewStudent from "../../pages/new/NewStudent";
import NewFaculty from "../../pages/new/NewFaculty";
import NewCourse from "../../pages/new/NewCourse";
import NewEvent from "../../pages/new/NewEvent"
import NewClass from "../../pages/new/CreateClass";
import NewUpdate from "../../pages/new/NewUpdate";
import EditEvent from "../../pages/edit/EditEvent"
import EditUpdate from "../../pages/edit/EditUpdate";
import EditCourse from "../../pages/edit/EditCourse";
import EditStudent from "../../pages/edit/EditStudent";
import EditFaculty from "../../pages/edit/EditFaculty";
import FacultyProfile from "../../pages/profile/FacultyProfile";
import StudentProfile from '../../pages/profile/StudentProfile';
import Class from "../../pages/class/Class";
import AddClass from "../../pages/class/AddClass";
import ViewClass from "../../pages/class/ViewClass";
import TableWithoutAction from '../../components/table/TableWithoutAction';
import NewTimeTable from '../../pages/timetable/NewTimeTable';
import UploadMaterial from '../../pages/new/UploadMaterial';
import Layout from '../../components/sidebar/Layout';
import EditMaterial from '../../pages/edit/EditMaterial';
import Timetable from '../../components/timetable/Timetable';

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

import { useAuth } from '../../config/context/AuthContext';
import EventsList from '../../pages/event/EventsList';
import ResetPassword from '../../pages/auth/ResetPassword';
import EditSchool from '../../pages/school/EditSchool';
import AdminHome from '../../pages/home/AdminHome';
import AddExamDates from '../../pages/exams/AddExamDates';

const AdminRoutes = () => {

  const { user } = useAuth();
  
  const RequireAdmin = ({ children }) => {
    if (user && user.role === "admin") {
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
            path="students/single/:studentId" 
            element={<StudentProfile type="Admin" />} 
          />
          
          {/* edit page for student */}
          <Route 
            path="students/edit/:studentId" 
            element={<EditStudent title="Update Student" />} 
            />

          {/* create user student */ }
          <Route 
            path="students/new" 
            element={<NewStudent inputs={studentInputs} title="Add New Student" />} 
            />


        {/* ROUTES FOR FACULTIES */}

          {/* list of faculties */}
          <Route 
            path="faculties" 
            element={<List column={facultyColumns} name="Faculty" />}
            />

          {/* single page for faculty */}
          <Route 
            path="faculties/single/:facultyId" 
            element={<FacultyProfile type="Admin" />} 
            />

          {/* edit page for faculty */}
          <Route 
            path="faculties/edit/:facultyId/" 
            element={<EditFaculty title="Update Faculty" /> }
            />

          {/* create faculty */}
          <Route 
            path="faculties/new" 
            element={<NewFaculty inputs={facultyInputs} title="Add New Faculty" />} 
            />


        {/* ROUTES FOR UPDATES */}

          {/* list of updates */}
          <Route 
            path="updates" 
            element={<List column={updateColumns} name="Update" />} 
            />

          {/* edit update */}
          <Route 
            path="updates/edit/:updateId" 
            element={ <EditUpdate title="Edit Updates" />} 
            />

          {/* create update page */}
          <Route 
            path="updates/new" 
            element={<NewUpdate inputs={updateInputs} title="Add New Update"  /> }
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
            element={ <NewCourse inputs={courseInputs} title="Add New Course" />}
          />

          {/* edit courses */}

          <Route
            path="courses/edit/:courseId/"
            element={ <EditCourse title="Edit Courses" />}
            />

        {/* ROUTES FOR MATERIALS */}

          {/* create material */}
          <Route
            path="materials/new"
            element={ <UploadMaterial title="Create Material" inputs={materialInputs}/>}
          />

          {/* list of materials */}
          <Route
            path="materials"
            element={ <List column={materialColumns} name="Material"/>}
          />

          {/* edit materials */}
          <Route
            path="materials/edit/:materialId"
            element={ <EditMaterial title="Edit Material"/>}
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

          {/* edit classes */}

          <Route
            path="faculties/addCourse/:facId"
            element={ <AddClass />} 
          />

          {/* view class */}
          <Route
            path="classes/:classId"
            element={ <ViewClass />}
            />

        {/* ROUTES FOR EVENTS */}

          {/* edit events */}
          <Route
            path="events/edit/:eventId"
            element={ <EditEvent inputs={eventInputs} title="Edit Event" />}
            />

          {/* create events */}
          <Route
            path="events/new"
            element={ <NewEvent inputs={eventInputs}  title="Add New Event" />}
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

          {/* view timetables */}
          <Route
            path='timetables/:classId'
            element={<Timetable />}
            />

        {/* Add exam dates */}
        <Route
          path="exams/dates"
          element={<AddExamDates />}
        />

        {/* ROUTES FOR SCHOOLS & SESSIONS */}
          {/* create new timetables */}
          <Route
            path='school/edit/:schoolId'
            element={<EditSchool title="Edit School Info" />}
          />

          {/* edit password */}
          <Route
            path="updatePassword/:adminId"
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
