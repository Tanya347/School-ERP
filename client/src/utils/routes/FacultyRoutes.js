// src/routes/facultyRoutes.js
import { Routes, Route } from 'react-router-dom';

// New forms
import TaskForm from '../../pages/shared/TaskForm';
import TestForm from '../../pages/shared/TestForm';
import UpdateForm from '../../pages/shared/UpdateForm';
import MaterialForm from '../../pages/shared/MaterialForm';
import FacultyForm from '../../pages/shared/FacultyForm';

// Components
import List from '../../components/shared/list/List';
import TableWithoutAction from "../../components/table/TableWithoutAction"
import Layout from '../../components/sidebar/Layout';
import AddMarks from '../../pages/marks/AddMarks';

// Pages
import FacultyProfile from "../../pages/profile/FacultyProfile";
import Events from '../../pages/event/Events';
import ViewStudents from '../../pages/viewStudents/ViewStudents';
import MarkAttendance from '../../pages/attendance/MarkAttendance';
import AttendanceInfo from '../../pages/attendance/AttendanceInfo';
import ViewMarks from '../../pages/marks/ViewMarks';
import ViewTestMarks from '../../pages/test/ViewTestMarks';
import EventsList from '../../pages/event/EventsList';
import FacultyHome from '../../pages/home/FacultyHome';
import ResetPassword from '../../pages/auth/ResetPassword';
import Timetable from '../../pages/timetable/Timetable';

// Form Inputs
import { taskInputs } from '../formsource/taskInputs';
import { testInputs } from '../formsource/testInputs';
import { updateInputs } from '../formsource/updateInputs';
import { materialInputs } from '../formsource/materialInputs';
import { facultyInputs } from '../formsource/facultyInputs';

// Datatable Columns
import { taskColumns } from '../datatablesource/taskColumns';
import { testColumns } from '../datatablesource/testColumns';
import { attendanceColumns } from "../datatablesource/attendanceColumns"
import { updateColumns } from '../datatablesource/updateColumns';
import { materialColumns } from '../datatablesource/materialColumns';

const FacultyRoutes = () => {

  return (
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
            element={<FacultyForm mode="edit" inputs={facultyInputs} title="Edit Profile" />}
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
            element={<TaskForm mode="create" inputs={taskInputs} title="Add New Task" />}
            />

          {/* edit page for tasks */}
          <Route
            path="tasks/edit/:id"
            element={<TaskForm mode="edit" inputs={taskInputs} title="Update Task" />}
            />

          {/* ROUTES FOR UPDATES */}

          {/* add new updates */}

          <Route
            path="updates/new"
            element={<UpdateForm mode="create" inputs={updateInputs} title="Add New Update" />}
            />

          <Route
            path="updates"
            element={<List column={updateColumns} name="Update" />}
            />

          {/* edit page for tasks */}
          <Route
            path="updates/edit/:id"
            element={<UpdateForm mode="edit" inputs={updateInputs} title="Edit Updates" />}
            />

          {/* ROUTES FOR MATERIALS */}

          {/* create materials */}
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

          {/* ROUTES FOR TESTS */}

          {/* list of tests */}
          <Route
            path="tests"
            element={ <List column={testColumns} name="Test" />}
            />

          {/* edit page for tests */}
          <Route
            path="tests/edit/:id"
            element={<TestForm mode="edit" inputs={testInputs} title="Update Test" />}
            />

          {/* create test page */}
          <Route
            path="tests/new"
            element={<TestForm mode="create" inputs={testInputs} title="Add New Test" />}
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
          <Route
            path="class/students/:courseId"
            element={<ViewStudents />}
            />

          {/* mark attendance page */}
          <Route
            path="attendance/new"
            element={<MarkAttendance />}
            />

          {/* view and edit attendance on faculty side */}
          <Route
            path="attendance"
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
          <Route
            path="marks/new/:courseId"
            element={<AddMarks />}
            />

          {/* view marks page */}
          <Route
            path="marks"
            element={<ViewMarks />}
            />
          <Route
            path="marks/:courseId"
            element={<ViewMarks />}
            />

          {/* add test marks page */}
          <Route
            path="tests/marks/:id"
            element={<ViewTestMarks />}
            />

          {/* view events page */}
          <Route
            path="events"
            element={<EventsList type="Faculty"/>}
            />

          {/* view timetables */}
          <Route
            path='timetable'
            element={<Timetable type="faculty"/>}
            />

          {/* edit password */}
          <Route
            path="updatePassword/:token"
            element={<ResetPassword type="change"/>}
            />
        </Routes>
        </Layout>
  );
};

export default FacultyRoutes;
