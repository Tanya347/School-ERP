// src/routes/facultyRoutes.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { taskColumns } from '../datatablesource/taskColumns';
import { queryColumns } from '../datatablesource/queryColumns';
import { testColumns } from '../datatablesource/testColumns';
import {attendanceColumns} from "../datatablesource/attendanceColumns"
import { taskInputs } from '../formsource/taskInputs';

import NewTask from '../../pages/task/NewTask';
import List from '../../pages/list/List';
import Home from '../../pages/home/Home';
import SingleFaculty from "../../pages/singleFaculty/SingleFaculty";
import EditFaculty from '../../pages/faculty/EditFaculty';
import EditTask from '../../pages/task/EditTask';
import EditTest from '../../pages/test/EditTest';
import NewTest from '../../pages/test/NewTest';
import Events from '../../pages/event/Events';
import ViewStudents from '../../pages/viewStudents/ViewStudents';
import { AuthContext } from '../../config/context/AuthContext';
import MarkAttendance from '../../pages/attendance/MarkAttendance';
import AttendanceInfo from '../../pages/attendance/AttendanceInfo';
import AddMarks from '../../pages/marks/AddMarks';
import ViewMarks from '../../pages/marks/ViewMarks';
import TableWithoutAction from "../../pages/table/TableWithoutAction"
import ViewTestMarks from '../../pages/test/ViewTestMarks';



const FacultyRoutes = () => {

  const { user } = useContext(AuthContext);

  const RequireFaculty = ({ children }) => {
    if(user) {
      return user.isFaculty ? children : <Navigate to="/" />;
    }
    else
      return <Navigate to="/" />;
};

  return (
      <RequireFaculty>
        <Routes>

          {/* dashboard of main */}
          <Route
            index
            element={ <Home type="Main" />}
          />

          {/* profile page for faculty */}
          <Route
            path="single/:id"
            element={<SingleFaculty type="Main" />}
          />

          {/* edit profile page for faculty */}
          <Route
            path="edit/:id"
            element={<EditFaculty title="Edit Profile" type="Main" />}
          />


          {/* ROUTES FOR TASKS */}

          {/* list of tasks */}
          <Route
            path="tasks"
            element={<List column={taskColumns} name="Task" type="Creator" />}
          />

          {/* add new tasks */}

          <Route
            path="tasks/new"
            element={<NewTask title="Add New Task" inputs={taskInputs} />}
          >
          </Route>

          {/* edit page for tasks */}
          <Route
            path="tasks/edit/:taskId"
            element={<EditTask title="Update Task" />}
          />

          {/* ROUTES FOR TESTS */}

          {/* list of tests */}
          <Route 
            path="tests" 
            element={ <List column={testColumns} name="Test" type="Creator" />} 
          />

          {/* edit page for tests */}
          <Route
            path="tests/edit/:testId"
            element={<EditTest title="Update Test" />}
          />

          {/* create test page */}
          <Route
            path="tests/new"
            element={<NewTest title="Add New Test" />}
          />

          {/* events */}
          <Route
            path="events"
            element={ <Events />}
          />

          {/* Students on Faculty Side */}
          <Route
            path="class/students"
            element={<ViewStudents />}
          />

          {/* query page faculty side*/}
          <Route
            path="queries"
            element={<List column={queryColumns} type="Faculty" name="Query" />}
          />

          {/* mark attendance page */}
          <Route 
            path="attendance/new"
            element={<MarkAttendance />}
          />

          {/* view and edit attendance on faculty side */}
          <Route
            path='attendance'
            element={<AttendanceInfo />}
          />

          {/* student attendance percentage */}
          <Route
            path="classes/attendance/:classId"
            element={ <TableWithoutAction column={attendanceColumns} name="Attendance" />}
          />

          {/* add marks page */}
          <Route 
            path="marks/new"
            element={<AddMarks />}
          />

          {/* view marks page */}
          <Route 
            path="marks"
            element={<ViewMarks />}
          />

          {/* add test marks page */}
          <Route 
            path="tests/marks/:testId"
            element={<ViewTestMarks />}
          />
        </Routes>
      </RequireFaculty>
  );
};

export default FacultyRoutes;
