// src/routes/adminRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../../pages/home/Home';
import List from '../../pages/list/List';
import NewStudent from "../../pages/student/NewStudent";
import NewFaculty from "../../pages/faculty/NewFaculty";
import NewCourse from "../../pages/course/NewCourse";
import NewEvent from "../../pages/event/NewEvent"
import EditEvent from "../../pages/event/EditEvent"
import NewUpdate from "../../pages/update/NewUpdate";
import EditUpdate from "../../pages/update/EditUpdate";
import EditCourse from "../../pages/course/EditCourse";
import EditStudent from "../../pages/student/EditStudent";
import EditFaculty from "../../pages/faculty/EditFaculty";
import SingleFaculty from "../../pages/singleFaculty/SingleFaculty";
import SingleStudent from '../../pages/singleStudent/SingleStudent';
import Class from "../../pages/class/Class";
import AddClass from "../../pages/class/AddClass";
import ViewClass from "../../pages/class/ViewClass";
import AdminNavbar from '../../components/navbar/AdminNavbar';

// Datatable Columns
import { studentColumns } from "../datatablesource/studentColumns";
import { facultyColumns } from "../datatablesource/facultyColumns";
import { updateColumns } from "../datatablesource/updateColumns";
import { courseColumns } from "../datatablesource/courseColumns";

// Form Inputs
import { studentInputs } from "../formsource/studentInputs";
import { facultyInputs } from "../formsource/facultyInputs";
import { updateInputs } from "../formsource/updateInputs";
import { courseInputs } from "../formsource/courseInputs";
import { useAuth } from '../../config/context/AuthContext';
import { attendanceColumns } from '../datatablesource/attendanceColumns';
import { marksColumns } from '../datatablesource/marksColumns';
import { eventInputs } from '../formsource/eventInputs';
import TableWithoutAction from '../../pages/table/TableWithoutAction';
import NewTimeTable from '../../pages/timetable/NewTimeTable';
import EditTimeTable from '../../pages/timetable/EditTimeTable';
import Timetable from '../../pages/timetable/Timetable';

const AdminRoutes = () => {

  const { user } = useAuth();
  
  const RequireAdmin = ({ children }) => {
    return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

  return (
      <RequireAdmin>
        <Routes>
          <Route 
            index
            element={<RequireAdmin><Home type="Admin" /></RequireAdmin>} 
          />
          
        {/* ROUTES FOR STUDENTS */}
          
          {/* list of students */}
          <Route 
            path="students" 
            element={<List column={studentColumns} name="Student" type="Admin" />} 
          />
          
          {/* single page for student */}
          <Route 
            path="students/single/:studentId" 
            element={<SingleStudent type="Admin" />} 
          />
          
          {/* edit page for student */}
          <Route 
            path="students/edit/:studentId" 
            element={<EditStudent title="Update Student" type="Admin" />} 
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
            element={<List column={facultyColumns} name="Faculty" type="Admin" />}
          />

          {/* single page for faculty */}
          <Route 
            path="faculties/single/:facultyId" 
            element={<SingleFaculty type="Admin" />} 
          />

          {/* edit page for faculty */}
          <Route 
            path="faculties/edit/:facultyId/" 
            element={<EditFaculty title="Update Faculty" type="Admin" /> }
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
            element={<List column={updateColumns} name="Update" type="Admin" />} 
          />

          {/* edit update */}
          <Route 
            path="updates/edit/:updateId" 
            element={ <EditUpdate title="Edit Updates" type="Admin" />} 
          />

          {/* create update page */}
          <Route 
            path="updates/new" 
            element={<NewUpdate inputs={updateInputs} title="Add New Update" type="Admin" /> }
          />
        
        {/* ROUTES FOR COURSES */}

          {/* list of courses */}

          <Route
            path="courses"
            element={ <List column={courseColumns} name="Course" type="Admin" />}
          />

          {/*  create new courses */}

          <Route
            path="courses/new"
            element={ <NewCourse inputs={courseInputs} title="Add New Course" />}
          />

          {/* edit courses */}

          <Route
            path="courses/edit/:courseId/"
            element={ <EditCourse title="Edit Courses" type="Admin" />}
          />

        {/* ROUTES FOR CLASSES */}

          {/* list of classes */}

          <Route
            path="classes"
            element={ <Class />}
          />

          {/* attendance of classes */}

          <Route
            path="classes/attendance/:classId"
            element={ <TableWithoutAction column={attendanceColumns} name="Attendance" NavbarComponent={AdminNavbar} />}
          />

          {/* marks of classes */}

          <Route
            path="classes/marks/:classId"
            element={ <TableWithoutAction column={marksColumns} name="Marks" NavbarComponent={AdminNavbar}/>}
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
            element={ <NewEvent inputs={eventInputs}  title="Add New Event" type="Admin" />}
          />

        {/* ROUTES FOR TIMETABLES */}

          {/* create new timetables */}
          <Route
            path="timetables/new"
            element={ <NewTimeTable />}
          />

          {/* edit timetables */}
          <Route
            path='timetables/edit/:id'
            element={ <EditTimeTable />}
          />

          {/* view timetables */}
          <Route
            path='timetables'
            element={<Timetable />}
          />
        </Routes>
      </RequireAdmin>
  );
};

export default AdminRoutes;
