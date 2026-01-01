import { Routes, Route, Navigate } from 'react-router-dom';

import EditStudent from '../../pages/edit/EditStudent';
import StudentProfile from '../../pages/profile/StudentProfile';
import List from '../../components/list/List';
import Events from '../../pages/event/Events';
import StudentHome from '../../pages/home/StudentHome';
import Layout from '../../components/sidebar/Layout';

import { taskColumns } from '../datatablesource/taskColumns';
import { testColumns } from '../datatablesource/testColumns';
import { materialColumns } from '../datatablesource/materialColumns';
import { updateColumns } from '../datatablesource/updateColumns';

import { useAuth } from '../context/AuthContext';
import EventsList from '../../pages/event/EventsList';
import ViewExamDates from '../../pages/exams/ViewExamDates';
import Marksheet from '../../pages/marks/Marksheet';
import ResetPassword from '../../pages/auth/ResetPassword';

const StudentRoutes = () => {
    const { user } = useAuth();
  
    const RequireStudent = ({ children }) => {
        if(user && user.role === 'student') {
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
            <Route path="updatePassword/:studentId" element={<ResetPassword type="change"/>}
          />
        </Routes>
       </Layout>
    </RequireStudent>
  );
};

export default StudentRoutes;
