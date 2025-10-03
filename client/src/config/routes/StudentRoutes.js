import { Routes, Route, Navigate } from 'react-router-dom';

import EditStudent from '../../pages/student/EditStudent';
import SingleStudent from '../../pages/singleStudent/SingleStudent';
import List from '../../pages/list/List';
import Events from '../../pages/event/Events';
import StudentHome from '../../pages/home/StudentHome';
import Layout from '../../components/sidebar/Layout';

import { taskColumns } from '../datatablesource/taskColumns';
import { testColumns } from '../datatablesource/testColumns';
import { materialColumns } from '../datatablesource/materialColumns';

import { useAuth } from '../context/AuthContext';
import EventsList from '../../pages/event/EventsList';
import ViewExamDates from '../../pages/exams/ViewExamDates';

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
            <Route index element={<StudentHome type="Main" />} />
            <Route path="single/:id" element={<SingleStudent type="Main" />} />
            <Route path="edit/:id" element={<EditStudent title="Edit Profile" type="Main" />} />
            <Route path="tasks" element={<List column={taskColumns} type="Main" name="Task" />} />
            <Route path="tests" element={<List column={testColumns} name="Test" type="Main" />} />
            <Route path="calender" element={<Events />} />
            <Route path="events" element={<EventsList type="Student"/>} />
            <Route path="materials" element={ <List column={materialColumns} name="Material" type="Main"/>}/>
            <Route path="exams" element={<ViewExamDates />} />
        </Routes>
       </Layout>
    </RequireStudent>
  );
};

export default StudentRoutes;
