import "./viewStudents.scss"

import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

import useFetch from '../../config/service/useFetch';
import { getClassDetails, getFacultyData } from '../../config/endpoints/get';
import { studentColumns } from '../../config/tableSource/studentsColumns';
import axiosInterceptor from "../../config/axiosInterceptor";

import GenericTable from '../../components/shared/table/Table';


const ViewStudents = () => {
  
  const [sclass, setSclass] = useState("");
  const [className, setClassName] = useState("");
  const [stuData, setStuData] = useState({});

  const { user } = useSelector(state => state.auth);
  const classes = useFetch(getFacultyData(user._id, "classes")).data

  useEffect(() => {
    const fetchStudents = async () => {
      if (sclass) {
        try {
          const response = await axiosInterceptor.get(getClassDetails(sclass));
          setStuData(response.data.data);
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchStudents();
  }, [sclass])

  const handleClick = (cl) => {
    setSclass(cl._id);
    setClassName(cl.name);
  };
  
  return (
    <div className='view-students'>
      <h1 className='student-title'>Students</h1>
      <div className="view-students-container">
        <div className="classes-button">
          {
            classes?.map((cl, index) => (
              <button
                key={index}
                onClick={() => handleClick(cl)}
                className={sclass === cl._id ? "selected-class" : ""}
              >{cl.name}</button>
            ))
          }
        </div>
        {sclass ? 
          (
            <>
              <h1>Class: {className}</h1>
            </>
          ) : (
            <>
              <h1>Please select a class</h1>
            </>
          )
        }
        <div className="studentlist-container">
          {sclass && stuData && stuData?.students && <GenericTable columns={studentColumns} rows={stuData.students} rowKey='id' />}
        </div>
      </div>
    </div>
  )
}

export default ViewStudents