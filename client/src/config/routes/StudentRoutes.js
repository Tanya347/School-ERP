import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { taskColumns } from '../datatablesource/taskColumns';
import { testColumns } from '../datatablesource/testColumns';

import EditStudent from '../../pages/student/EditStudent';
import SingleStudent from '../../pages/singleStudent/SingleStudent';
import Response from "../../pages/response/Response"
import List from '../../pages/list/List';
import Events from '../../pages/event/Events';
import { useAuth } from '../context/AuthContext';
import NewEvent from '../../pages/event/NewEvent';
import StudentHome from '../../pages/home/StudentHome';
import Layout from '../../components/sidebar/Layout';

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
            <Route path="events" element={<NewEvent type="Main" />} />
            <Route path="responses" element={<Response />} />
        </Routes>
       </Layout>
    </RequireStudent>
  );
};

export default StudentRoutes;
