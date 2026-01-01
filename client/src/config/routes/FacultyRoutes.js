// src/routes/facultyRoutes.js
import { Routes, Route, Navigate } from 'react-router-dom';


import NewTask from '../../pages/new/NewTask';
import List from '../../components/list/List';
import FacultyProfile from "../../pages/profile/FacultyProfile";
import EditFaculty from '../../pages/edit/EditFaculty';
import EditTask from '../../pages/edit/EditTask';
import EditTest from '../../pages/edit/EditTest';
import NewTest from '../../pages/new/NewTest';
import Events from '../../pages/event/Events';
import ViewStudents from '../../pages/viewStudents/ViewStudents';
import MarkAttendance from '../../pages/attendance/MarkAttendance';
import AttendanceInfo from '../../pages/attendance/AttendanceInfo';
import AddMarks from '../../pages/marks/AddMarks';
import ViewMarks from '../../pages/marks/ViewMarks';
import TableWithoutAction from "../../components/table/TableWithoutAction"
import ViewTestMarks from '../../pages/test/ViewTestMarks';
import Layout from '../../components/sidebar/Layout';
import NewUpdate from '../../pages/new/NewUpdate';
import EditUpdate from '../../pages/edit/EditUpdate';
import UploadMaterial from '../../pages/new/UploadMaterial';

import { taskInputs } from '../formsource/taskInputs';
import { testInputs } from '../formsource/testInputs';
import { updateInputs } from '../formsource/updateInputs';
import { materialInputs } from '../formsource/materialInputs';

import { taskColumns } from '../datatablesource/taskColumns';
import { queryColumns } from '../datatablesource/queryColumns';
import { testColumns } from '../datatablesource/testColumns';
import {attendanceColumns} from "../datatablesource/attendanceColumns"
import { updateColumns } from '../datatablesource/updateColumns';
import { materialColumns } from '../datatablesource/materialColumns';

import { useAuth } from '../../config/context/AuthContext';
import EventsList from '../../pages/event/EventsList';
import FacultyHome from '../../pages/home/FacultyHome';
import ResetPassword from '../../pages/auth/ResetPassword';

const FacultyRoutes = () => {

  const { user } = useAuth();

  const RequireFaculty = ({ children }) => {
    if (user && user.role === "faculty") {
      return children;
    } else {
      return <Navigate to="/" />;
    }
};

  return (
      <RequireFaculty>
        <Layout>

        <Routes>

          {/* dashboard of main */}
          <Route
            index
            element={ <FacultyHome />}
            />

          {/* profile page for faculty */}
          <Route
            path="single/:id"
            element={<FacultyProfile type="Main" />}
            />

          {/* edit profile page for faculty */}
          <Route
            path="edit/:id"
            element={<EditFaculty title="Edit Profile" />}
          />
          

          {/* ROUTES FOR TASKS */}

          {/* list of tasks */}
          <Route
            path="tasks"
            element={<List column={taskColumns} name="Task" />}
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

          {/* ROUTES FOR UPDATES */}

          {/* add new updates */}

          <Route
            path="updates/new"
            element={<NewUpdate title="Add New Update" inputs={updateInputs} />}
            >
          </Route>

          <Route
            path="updates"
            element={<List column={updateColumns} name="Update" />}
          />

          {/* edit page for tasks */}
          <Route
            path="updates/edit/:taskId"
            element={<EditUpdate title="Edit Update" />}
          />

          {/* ROUTES FOR MATERIALS */}

          {/* create materials */}
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
            element={ <List title="Edit Material"/>}
          />

          {/* ROUTES FOR TESTS */}

          {/* list of tests */}
          <Route 
            path="tests" 
            element={ <List column={testColumns} name="Test" />} 
            />

          {/* edit page for tests */}
          <Route
            path="tests/edit/:testId"
            element={<EditTest title="Update Test" />}
            />

          {/* create test page */}
          <Route
            path="tests/new"
            element={<NewTest title="Add New Test" inputs={testInputs} />}
            />

          {/* events */}
          <Route
            path="calender"
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
            element={<List column={queryColumns} name="Query" />}
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
            path="courses/attendance/:courseId"
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

          {/* view events page */}
          <Route 
            path="events"
            element={<EventsList type="Faculty"/>}
            />

          {/* edit password */}
          <Route
            path="updatePassword/:facultyId"
            element={<ResetPassword type="change"/>}
          />
        </Routes>
        </Layout>
      </RequireFaculty>
  );
};

export default FacultyRoutes;
