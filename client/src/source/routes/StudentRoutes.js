import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { taskColumns } from '../datatablesource/taskColumns';
import { testColumns } from '../datatablesource/testColumns';

import EditStudent from '../../pages/student/EditStudent';
import SingleStudent from '../../pages/singleStudent/SingleStudent';
import Home from '../../pages/home/Home';
import Response from "../../pages/response/Response"
import List from '../../pages/list/List';
import Events from '../../pages/event/Events';
import { AuthContext } from '../../context/AuthContext';

const StudentRoutes = () => {
    const { user } = useContext(AuthContext);
  
    const RequireStudent = ({ children }) => {
        if(user) {
          return user.isStudent ? children : <Navigate to="/home" />;
        }
        else
          return <Navigate to="/home" />;
    };

  return (

    <RequireStudent>
        <Routes>
            <Route path="/student" element={<Home type="Main" />} />
            <Route path="/students/:id" element={<SingleStudent type="Main" />} />
            <Route path="/students/:id/edit" element={<EditStudent title="Edit Profile" type="Main" />} />
            <Route path="/stuTasks" element={<List column={taskColumns} type="Main" name="Task" />} />
            <Route path="/stuTests" element={<List column={testColumns} name="Test" type="Main" />} />
            <Route path="/student/events" element={<Events />} />
            <Route path="/responses" element={<Response />} />
        </Routes>
    </RequireStudent>
  );
};

export default StudentRoutes;
