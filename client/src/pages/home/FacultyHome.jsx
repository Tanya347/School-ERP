import React from 'react'
import './facultyHome.scss'
import SchoolInfo from '../../components/schoolInfo/SchoolInfo'
import { useAuth } from '../../config/context/AuthContext';
import GenericTable from '../../components/table/Table';
import { updateColumns } from "../../config/tableSource/updateColumns";
import useFetch from '../../config/service/useFetch';
import { getTableURL } from '../../config/endpoints/get';
import EventCalender from '../../components/calender/Calender';
import Lecture from '../../components/lecture/Lecture';

const FacultyHome = () => {
  const {user} = useAuth();
  const { data } = useFetch(getTableURL(user));

  return (
    <div className='faculty-home-container'>

      <div className="main-container">

        <div className="left-container">
          <SchoolInfo schoolID={user.schoolID} />
          <div className="notifications-container">
            <h2 className="listTitle">Latest Notifications</h2>
              <GenericTable columns={updateColumns} rows = {data} rowKey="id" isScrollable={true}/>
          </div>
        </div>
        <div className="right-container">
          <EventCalender />
          <Lecture id={user?._id} type={user?.role}/>
        </div>
      </div>
    </div>
  )
}

export default FacultyHome