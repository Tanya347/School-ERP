import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import EditStudent from '../../pages/edit/EditStudent';
import StudentProfile from '../../pages/profile/StudentProfile';
import List from '../../components/shared/list/List';
import Events from '../../pages/event/Events';
import StudentHome from '../../pages/home/StudentHome';
import Layout from '../../components/sidebar/Layout';
import EventsList from '../../pages/event/EventsList';
import ViewExamDates from '../../pages/exams/ViewExamDates';
import Marksheet from '../../pages/marks/Marksheet';
import ResetPassword from '../../pages/auth/ResetPassword';
import Timetable from '../../pages/timetable/Timetable';

import { taskColumns } from '../datatablesource/taskColumns';
import { testColumns } from '../datatablesource/testColumns';
import { materialColumns } from '../datatablesource/materialColumns';
import { updateColumns } from '../datatablesource/updateColumns';

import { roles } from "../utils/constants"

const StudentRoutes = () => {
    const { user } = useSelector(state => state.auth);
  
    const RequireStudent = ({ children }) => {
        if(user && user.role === roles.student) {
          return children;
        } else
          return <Navigate to="/" />;
    };

  return (

    <RequireStudent>
       <Layout>
        <Routes>
            <Route index element={<StudentHome />} />
            <Route path="single/:id" element={<StudentProfile type="Main" />} />
            <Route path="edit/:id" element={<EditStudent title="Edit Profile" />} />
            <Route path="tasks" element={<List column={taskColumns} name="Task" />} />
            <Route path="tests" element={<List column={testColumns} name="Test" />} />
            <Route path="calender" element={<Events />} />
            <Route path="events" element={<EventsList type="Student"/>} />
            <Route path="materials" element={ <List column={materialColumns} name="Material"/>}/>
            <Route path="exams" element={<ViewExamDates />} />
            <Route path="marks" element={<Marksheet />}/>
            <Route path="updates" element={<List column={updateColumns} name="Update" />}/>
            <Route path="updatePassword/:studentId" element={<ResetPassword type="change"/>} />
            <Route path="timetable" element={<Timetable type="class"/>} />
        </Routes>
       </Layout>
    </RequireStudent>
  );
};

export default StudentRoutes;
